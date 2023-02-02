import 'dotenv/config'
import YoutubeDlWrap from "youtube-dl-wrap";
import debugFactory from 'debug';
import { EventEmitter } from 'node:events';
import { AbortController } from "node-abort-controller";
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path'
import ffmpeg from 'fluent-ffmpeg'

const debug = debugFactory('voddo');
const defaultStats = {segments:[],lastUpdatedAt:null}

export default class Voddo extends EventEmitter {
  constructor(opts) {
    super()
    this.courtesyTimer = setTimeout(() => {}, 0);
    this.retryCount = 0;
    this.url = opts.url;
    this.format = opts.format || 'best';
    this.cwd = opts.cwd;
    this.ytdlee; // event emitter for ytdlwrap
    this.stats = Object.assign({}, defaultStats);
    this.abortController = new AbortController();
    this.ytdl = opts.ytdl || new YoutubeDlWrap();
    this.mediainfoBinary || '/usr/bin/mediainfo';
    if (process.env.YOUTUBE_DL_BINARY) this.ytdl.setBinaryPath(process.env.YOUTUBE_DL_BINARY);
  }

  static async getVideoLength (filePath) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, function(err, metadata) {
        if (err) reject(err)
        resolve(Math.floor(metadata.format.duration*1000))
      });
    })
  }

  // greets ChatGPT
  static groupStreamSegments(segments, threshold = 1000*60*60) {
    segments.sort((a, b) => a.startTime - b.startTime);
    const streams = [];
    let currentStream = [];

    for (let i = 0; i < segments.length; i++) {
      const currentSegment = segments[i];
      const previousSegment = currentStream[currentStream.length - 1];

      if (!previousSegment || currentSegment.startTime - previousSegment.endTime <= threshold) {
        currentStream.push(currentSegment);
      } else {
        streams.push(currentStream);
        currentStream = [currentSegment];
      }
    }

    streams.push(currentStream);
    return streams;
  }







  /**
   * getRecordedStreams
   * 
   * get the metadata of the videos captured
   */
  async getRecordedSegments() {
    let f = []
    const files = await readdir(this.cwd).then((raw) => raw.filter((f) => f.includes('.mp4')))
    for (const file of files) {
      const filePath = join(this.cwd, file)
      const s = await stat(filePath)
      const videoDuration = await Voddo.getVideoLength(filePath)
      const startTime = parseInt(s.ctimeMs)
      const endTime = startTime+videoDuration
      const size = s.size
      f.push({
        startTime,
        endTime,
        file,
        size
      })
    }
    this.stats.segments = f


    return this.stats.segments
  }

  isDownloading() {
    // if there are event emitter listeners for the progress event,
    // we are probably downloading.
    return (
      this.ytdlee?.listeners('progress').length !== undefined
    )
  }

  delayedStart() {
    // only for testing
    this.retryCount = 500
    this.courtesyTimer = this.getCourtesyTimer(() => this.download())
  }


  start() {
    // if download is in progress, do nothing
    if (this.isDownloading()) {
      debug('  [*] Doing nothing because a download is in progress.')
      return;
    }

    // if download is not in progress, start download immediately
    // reset the retryCount so the backoff timer resets to 1s between attempts
    this.retryCount = 0
    clearTimeout(this.courtesyTimer)

    // create new abort controller
    //this.abortController = new AbortController() // @todo do i need this? Can't I reuse the existing this.abortController?

    this.download()
  }

  stop() {
    debug('  [*] Received stop(). Stopping.')
    clearTimeout(this.courtesyTimer)
    this.abortController.abort()
  }

  /** generate a report **/
  getReport(errorMessage) {
    let report = {}
    report.stats = Object.assign({}, this.stats)
    report.error = errorMessage
    report.reason = (() => { 
      if (errorMessage) return 'error';
      else if (this.abortController.signal.aborted) return 'aborted';
      else return 'close';
    })()
    // clear stats to prepare for next run
    this.stats = Object.assign({}, defaultStats) 
    return report
  }

  emitReport(report) {
    debug('  [*] EMITTING REPORT')
    this.emit('stop', report)
  }

  getCourtesyTimer(callback) {
    // 600000ms = 10m
    const waitTime = Math.min(600000, (Math.pow(2, this.retryCount) * 1000));
    this.retryCount += 1;
    debug(`  [*] courtesyWait for ${waitTime/1000} seconds. (retryCount: ${this.retryCount})`)
    return setTimeout(callback, waitTime)
  }

  download() {
    const handleProgress = (progress) => {
      debug(`  [*] progress event`)
      this.stats.lastUpdatedAt = Date.now(),
      this.stats.totalSize = progress.totalSize
    }

    const handleError = (error) => {
      if (error?.message !== undefined && error.message.includes('Room is currently offline')) {
        debug('  [*] Handled an expected \'Room is offline\' error')

      } else {
        debug('  [*] ytdl error')
        console.warn(error.message)
      }
      this.ytdlee.off('progress', handleProgress)
      this.ytdlee.off('handleYtdlEvent', handleYtdlEvent)

      // restart the download after the courtesyTimeout
      this.courtesyTimer = this.getCourtesyTimer(() => this.download())
      this.emitReport(this.getReport(error.message))
    }


    const handleYtdlEvent = (type, data) => {
      debug(`  [*] handleYtdlEvent type: ${type}, data: ${data}`)
      console.log(`  [*] handleYtdlEvent type: ${type}, data: ${data}`)
      if (type === 'download' && data.includes('Destination:')) {
        let filePath = /Destination:\s(.*)$/.exec(data)[1]
        debug(`  [*] Destination file detected: ${filePath}`)
        let datum = { file: filePath, timestamp: new Date().valueOf() }
        let segments = this.stats.segments
        segments.push(datum) && segments.length > 64 && segments.shift(); // limit the size of the segments array
        this.emit('start', datum)
      } else if (type === 'ffmpeg' && data.includes('bytes')) {
        const bytes = /(\d*)\sbytes/.exec(data)[1]
        debug(`  [*] ffmpeg reports ${bytes}`)
        let mostRecentFile = this.stats.segments[this.stats.segments.length-1]
        mostRecentFile['size'] = bytes
        console.log(mostRecentFile)
      }
    }

    const handleClose = () => {
      debug('  [*] got a close event. handling!');

      this.ytdlee.off('progress', handleProgress)
      this.ytdlee.off('handleYtdlEvent', handleYtdlEvent)

      // restart Voddo only if the close was not due to stop()
      if (!this.abortController.signal.aborted) {
        // restart the download after the courtesyTimeout
        this.courtesyTimer = this.getCourtesyTimer(() => this.download())
      }

      this.emitReport(this.getReport())
    }

    debug(`  [*] Downloading url:${this.url} format:${this.format}`)
    debug(this.ytdl)

    this.ytdlee = this.ytdl.exec(
      [this.url, '-f', this.format], 
      { 
        cwd: this.cwd
      }, 
      this.abortController.signal
    );
    this.ytdlee.on('progress', handleProgress);
    this.ytdlee.on('youtubeDlEvent', handleYtdlEvent);
    this.ytdlee.once('error', handleError);
    this.ytdlee.once('close', handleClose);
  }



}