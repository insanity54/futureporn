import 'dotenv/config'
import YoutubeDlWrap from "youtube-dl-wrap";
import debugFactory from 'debug';
import { EventEmitter } from 'node:events';
import { AbortController } from "node-abort-controller";

const debug = debugFactory('voddo');
const defaultStats = {files:[],sizes:[],lastUpdatedAt:null}

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
		if (process.env.YOUTUBE_DL_BINARY) this.ytdl.setBinaryPath(process.env.YOUTUBE_DL_BINARY)
	}


	/**
	 * getFilenames
	 * 
	 * get the filenames of the files captured
	 * for only the most recent stream
	 */
	getFilenames() {
		// greets ChatGPT
		const groupThreshold = 1000*60*60*16; // 16 hours
		const groupedFiles = this.stats.files
		    .sort((a, b) => a.timestamp - b.timestamp)
		    .reduce((acc, file) => {
		        const lastGroup = acc[acc.length - 1];
		        if (!lastGroup || file.timestamp - lastGroup[lastGroup.length - 1].timestamp > groupThreshold) {
		            acc.push([file]);
		        } else {
		            lastGroup.push(file);
		        }
		        return acc;
		    }, []);

		return groupedFiles[groupedFiles.length-1]
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
			if (type === 'download' && data.includes('Destination:')) {
				let filePath = /Destination:\s(.*)$/.exec(data)[1]
				debug(`  [*] Destination file detected: ${filePath}`)
				let datum = { file: filePath, timestamp: new Date().valueOf() }
				let files = this.stats.files
				files.push(datum) && files.length > 64 && files.shift(); // limit the size of the files array
				this.emit('start', datum)
			} else if (type === 'ffmpeg' && data.includes('bytes')) {
				const bytes = /(\d*)\sbytes/.exec(data)[1]
				debug(`  [*] ffmpeg reports ${bytes}`)
				let mostRecentFile = this.stats.files[this.stats.files.length-1]
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