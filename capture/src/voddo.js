import YoutubeDlWrap from "youtube-dl-wrap";
import debugFactory from 'debug';
import { EventEmitter } from 'node:events';

const debug = debugFactory('futureporn/capture/voddo');
const ytdl = new YoutubeDlWrap();



export default class Voddo extends EventEmitter {
	constructor(opts) {
		super()
		this.courtesyTimer = setTimeout(() => {}, 0);
		this.retryCount = 0;
		this.url = opts.url;
		this.format = opts.format;
		this.cwd = opts.cwd;
		this.ytdlee; // event emitter for ytdlwrap
		this.stats = { filePaths: [] };
	}

	isDownloading() {
		// if there are event emitter listeners for the progress event,
		// we are probably downloading.


		// @todo this needs to be reset after stream completion!
		//       [x] progress listeners are automatically reset
		//       [x] this.stats.filePaths gets cleared by getReport
		//           
		return (
			this.ytdlee?.listeners('progress').length !== undefined &&
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

	/** generate a report **/
	getReport(error) {
		let report = {}
		report.stats = Object.assign({}, this.stats)
		report.reason = error ? error : 'close'
		// reset the filePaths
		this.stats.filePaths = []
		return report
	}

	emitReport(report) {
		this.emit('report', report)
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
				this.emit('file', { file: filePath })
				this.stats.filePaths.push(filePath)
			}
		}

		const handleClose = () => {
	        debug('  [*] got a close event');
			this.ytdlee.off('progress', handleProgress)
			this.ytdlee.off('handleYtdlEvent', handleYtdlEvent)
			// restart the download after the courtesyTimeout
			this.courtesyTimer = this.getCourtesyTimer(this.download)
			this.emitReport(this.getReport())
		}

		this.ytdlee = ytdl.exec([this.url, '-f', this.format], { cwd: this.cwd });
		this.ytdlee.on('progress', handleProgress);
		this.ytdlee.on('youtubeDlEvent', handleYtdlEvent);
	    this.ytdlee.once('error', handleError);
	    this.ytdlee.once('close', handleClose);
	}



}