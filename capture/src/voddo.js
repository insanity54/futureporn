import YoutubeDlWrap from "youtube-dl-wrap";
import debugFactory from 'debug'

const debug = debugFactory('futureporn/capture/voddo');
const ytdl = new YoutubeDlWrap();



export default class Voddo {
	constructor(opts) {
		this.courtesyTimer = setTimeout(() => {}, 0);
		this.retryCount = 0;
		this.url = opts.url;
		this.format = opts.format;
		this.cwd = opts.cwd;
		this.ee;
		this.stats = { filePaths: [] };
	}

	isDownloading() {
		// if there are event emitter listeners for the progress event,
		// we are probably downloading.


		// @todo this needs to be reset after stream completion!
		//       [*] progress listeners are automatically reset
		//       [ ] this.stats.filePaths needs to be cleared
		//           maybe triggered after a certain time period of capture failures
		//           
		return (
			this.ee?.listeners('progress').length !== undefined &&
			this.stats.filePaths.length > 0
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



		this.download()
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
			this.ee.off('progress', handleProgress)
			this.ee.off('handleYtdlEvent', handleYtdlEvent)

			// restart the download after the courtesyTimeout
			this.courtesyTimer = this.getCourtesyTimer(() => this.download())
		}


		const handleYtdlEvent = (type, data) => {
			debug(`  [*] handleYtdlEvent type: ${type}, data: ${data}`)
			if (type === 'download' && data.includes('Destination:')) {
				let filePath = /Destination:\s(.*)$/.exec(data)[1]
				debug(`  [*] Destination file detected: ${filePath}`)
				this.stats.filePaths.push(filePath)
			}
		}

		const handleClose = () => {
	        debug('  [*] got a close event');
			this.ee.off('progress', handleProgress)
			this.ee.off('handleYtdlEvent', handleYtdlEvent)
			// restart the download after the courtesyTimeout
			this.courtesyTimer = this.getCourtesyTimer(this.download)
		}

		this.ee = ytdl.exec([this.url, '-f', this.format], { cwd: this.cwd });
		this.ee.on('progress', handleProgress);
		this.ee.on('youtubeDlEvent', handleYtdlEvent);
	    this.ee.once('error', handleError);
	    this.ee.once('close', handleClose);
	}



}