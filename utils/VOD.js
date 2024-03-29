
/**
 * VOD.js
 */

const dotenv = require('dotenv')
dotenv.config();

const debug = require('debug')('futureporn');
const R = require('ramda');
const execa = require('execa');
const os = require('os');
const fsp = require('fs/promises');
const path = require('path');
const { add, isAfter, sub } = require('date-fns')
const dateFnsTz = require('date-fns-tz');
const fetch = require('node-fetch');
const Twitter = require('twitter-v2');
const Prevvy = require('prevvy');
const { fileURLToPath } = require('url');
const matter = require('gray-matter');
const { ipfsClusterUpload } = require('./ipfsCluster');
const { localTimeZone, later } = require('./constants');
const { format, zonedTimeToUtc, utcToZonedTime, toDate } = dateFnsTz;
const { convertToV1, isCidV0 } = require('./cid.js')
const ipfsHashRegex = /Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,}/;
const exoticTwitterDateFormat = "";



// const __dirname = fileURLToPath(path.dirname(import.meta.url)); // esm workaround for missing __dirname


class UploadFailedError extends Error {
	constructor (message) {
		super(R.defaultTo('Upload failed!'))
		this.name = 'UploadFailedError';
	}
}

class NotEnoughMemoryError extends Error {
	constructor (message) {
		super(R.defaultTo('This machine does not have enough RAM. ')(message));
		this.name = 'NotEnoughMemoryError';
	}
}

class RemuxError extends Error {
	constructor (message) {
		super(R.defaultTo('remux error')(message));
		this.name = 'RemuxError';
	}
}

class DateMissingError extends Error {
	constructor (message) {
		super(R.defaultTo('date is missing from VOD which is UNSUPPORTED')(message));
		this.name = 'DateMissingError';
	}
}

class AnnouceUrlMissingError extends Error {
	constructor (message) {
		super(R.defaultTo('announceUrl is missing from VOD which is UNSUPPORTED')(message));
		this.name = 'AnnouceUrlMissingError';
	}	
}

class VideoSrcHashMissingError extends Error {
	constructor (message) {
		super(R.defaultTo('videoSrcHash is missing from VOD which is UNSUPPORTED')(message));
		this.name = 'VideoSrcHashMissingError';
	}	
}

class TmpFilePathMissingError extends Error {
	constructor (message) {
		super(R.defaultTo('tmpFilePath is missing from VOD which is UNSUPPORTED')(message));
		this.name = 'TmpFilePathMissingError';
	}
}

class VideoMissingError extends Error {
	constructor (message) {
		super(R.defaultTo('The VOD data did not contain a video which is UNSUPPORTED')(message));
		this.name = 'VideoMissingError';
	}
}


if (typeof process.env.FUTUREPORN_WORKDIR === 'undefined') throw new Error('FUTUREPORN_WORKDIR is undefined in env.')

module.exports = class VOD {
	
	constructor (data) {
		if (typeof data === 'undefined') throw new Error('VOD() constructor must receive a data object')
		this.date = VOD._parseDate(data.date);
		this.title = VOD.default(data.title);
		this.videoSrc = VOD.default(data.videoSrc);
		this.videoSrcHash = VOD.default(data.videoSrcHash);
		this.video720Hash = VOD.default(data.video720Hash);
		this.video480Hash = VOD.default(data.video480Hash);
		this.video360Hash = VOD.default(data.video360Hash);
		this.video240Hash = VOD.default(data.video240Hash);
		this.thinHash = VOD.default(data.thinHash);
		this.thiccHash = VOD.default(data.thiccHash);
		this.announceTitle = VOD.default(data.announceTitle);
		this.announceUrl = VOD.default(data.announceUrl);
		this.note = VOD.default(data.note);
		this.layout = VOD.default(data.layout);
		this.tmpFilePath = VOD.default(data.tmpFilePath);
		this.video240TmpFilePath = VOD.default(data.video240TmpFilePath);
		this.twitterThrottleTimer = new Date();
		this.tags = R.defaultTo([])(data.tags);
	}

	static B2BucketName = 'futureporn';
	static rcloneDestination = 'b2';
	static dataDir = path.join(__dirname, '..', 'website', 'vods');
	static eleventyLayout = 'layouts/vod.njk';
	static default = R.defaultTo('');
	static web3Token = process.env.WEB3_TOKEN;
	static twitter = new Twitter({
		consumer_key:         process.env.TWITTER_API_KEY,
		consumer_secret:      process.env.TWITTER_API_KEY_SECRET
	})



	// greetz https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
	static fixedEncodeURIComponent(str) {
	  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
	    return '%' + c.charCodeAt(0).toString(16);
	  });
	}

	// greetz https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent
	static _containsEncodedComponents(x) {
	  return /%[0-9a-fA-F]+/.test(x); // &gt;
	}

	static _getIpfsHash (input) {
		const result = ipfsHashRegex.exec(input);
		return result[0]
	}

	static _getSafeText (text) {
		if (VOD._containsEncodedComponents(text)) return text;
		return VOD.fixedEncodeURIComponent(text);
	}

	static _getTmpDownloadPath (filename) {
		return path.join(process.env.FUTUREPORN_WORKDIR, filename);
	}

	static _parseDate (date) {
		if (R.isEmpty(date)) return '';
		if (R.isNil(date)) return '';
		if (R.is(Date, date)) return zonedTimeToUtc(date, localTimeZone);
		if (R.is(String, date)) return new Date(date);
	}



	async ensureCidV1 () {
	  const hashProperties = ['videoSrcHash', 'video240Hash', 'video360Hash', 'video480Hash', 'video720Hash', 'thiccHash', 'thinHash']
	  for (const property of hashProperties) {
	    if (isCidV0(this[property])) {
	      this[property] = await convertToV1(this[property])
	    }
	  }
	}


	async ensureThiccHash () {
		if (this.thiccHash !== '') return;
		await this.ensureTmpFilePath();
		if (this.tmpFilePath === '') {
			debug('  local video (tmpFilePath) is missing so im gonna throw')
			throw new VideoMissingError();
		} else {
			debug(`video is present ${this.tmpFilePath}`)
		}
		debug('Generating thiccHash Thumbnail...');
		const tmpDateStamp = new Date().valueOf()
		const thinThumbnailPath = path.join(os.tmpdir(), `${tmpDateStamp}_thin.jpg`);
		const thiccThumbnailPath = path.join(os.tmpdir(), `${tmpDateStamp}_thicc.jpg`);
		let thiccOpts = {
			input: this.tmpFilePath,
			output: thiccThumbnailPath,
			throttleTimeout: 10000,
			width: 128,
			cols: 5,
			rows: 5,
		};
		let pThicc = new Prevvy(thiccOpts);
		await pThicc.generate();
		const thiccFilePath = pThicc.output;
		const thiccHash = await this._ipfsUpload(thiccFilePath);
		if (typeof thiccHash === 'undefined') UploadFailedError('thiccHash was undefined after running the _ipfsUpload function');
		this.thiccHash = `${thiccHash}?filename=${this.getSafeDatestamp()}-thicc.jpg`;
	}


	async generateThumbnail () {
		if (this.tmpFilePath === '' && this.videoSrcHash === '') throw new VideoMissingError();
		const tmpDateStamp = new Date().valueOf()
		const thinThumbnailPath = path.join(os.tmpdir(), `${tmpDateStamp}_thin.jpg`);
		const thiccThumbnailPath = path.join(os.tmpdir(), `${tmpDateStamp}_thicc.jpg`);

		const videoInputSource = (this.videoSrcHash !== '') ? this.getIpfsUrl() : this.tmpFilePath;

		let thiccOpts = {
			input: videoInputSource,
			output: thiccThumbnailPath,
			throttleTimeout: 10000,
			width: 128,
			cols: 5,
			rows: 5,
		};
		let pThicc = new Prevvy(thiccOpts);
		await pThicc.generate();
		const thiccFilePath = pThicc.output;
		const thiccHash = await this._ipfsUpload(thiccFilePath);
		this.thiccHash = `${thiccHash}?filename=${this.getSafeDatestamp()}-thicc.jpg`;

		let thinOpts = {
			input: videoInputSource,
			output: thinThumbnailPath,
			throttleTimeout: 10000,
			width: 128,
			cols: 5,
			rows: 1,
		};
		let pThin = new Prevvy(thinOpts);
		await pThin.generate();
		const thinFilePath = pThin.output;
		const thinHash = await this._ipfsUpload(thinFilePath);
		this.thinHash = `${thinHash}?filename=${this.getSafeDatestamp()}-thin.jpg`;
	}

	async ensureTextFormatting () {
		// if announceTitle is double encoded, decode.
		if (/%2520/.test(this.announceTitle)) {
			this.announceTitle = decodeURIComponent(this.announceTitle)
		}

		// if announceTitle is not encoded, encode.
		else if (/ /.test(this.announceTitle)) {
			this.announceTitle = VOD._getSafeText(this.announceTitle)
		}

		// if title is double encoded, decode.
		else if (/%2520/.test(this.title)) {
			this.title = decodeURIComponent(this.title)
		}

		// if title is not encoded, encode.
		else if (/ /.test(this.title)) {
			this.title = VOD._getSafeText(this.title)
		}
	}

	ensureB2OrIpfs () {
		const fault = R.and(this.isMissingB2(), this.isMissingIpfs());
		if (fault) console.warn('neither b2 nor ipfs link exists on this VOD, which is unsupported.');
	}

	/**
	 * The only method for obtaining the date is by the announceUrl datestamp
	 * (directly from Twitter)
	 */
	getMethodToEnsureDate () {
		const isActionRequired = this.isMissingZuluDate();
		return isActionRequired ? this.getDateFromTwitter : null;
	}

	getMethodToEnsureEncode () {
		if(R.and(this.hasTmpFilePath(), this.isTmpFilePathMkv())) return this.encodeVideo;
		return null;
	}

	getMethodToEnsureTmpFilePath () {
		if (this.isMissingTmpFilePath() && this.hasIpfs()) return this.downloadFromIpfs;
		if (this.isMissingTmpFilePath() && this.hasB2()) return this.downloadFromB2;
		return null;
	}


	getMethodsToEnsureIpfs () {
		let methods = [];

		// already done. nothing to do
		if (this.hasIpfs()) return methods;

		// there is no vod to work with
		if (R.and(this.isMissingTmpFilePath(), this.isMissingB2())) return methods;

		// we have a local mkv to work with
		if (R.and(this.hasTmpFilePath(), this.isTmpFilePathMkv())) methods.push(this.encodeVideo);

		// we have a remote b2 video to work with
		if (this.hasB2()) {
			methods.push(this.downloadFromB2);
			methods.push(this.encodeVideo);
		}

		methods.push(this.uploadToIpfs);
		console.log(methods)

		return methods;
	}

	getMethodToEnsureThumbnail () {
		return this.isMissingThumbnail() ? this.generateThumbnail : null;
	}

	isTmpFilePathMkv () {
		return R.compose(
			R.test(/\.mkv$/),
			R.prop('tmpFilePath')
		)(this)
	}

	isMissingZuluDate () {
		return R.compose(
			R.or(
				R.isEmpty,
				R.not(R.test(/Z$/))
			),
			R.prop('date')
		)(this)
	}

	isMissingTmpFilePath () {
		return R.compose(
			R.isEmpty,
			R.prop('tmpFilePath')
		)(this)
	}

	isMissingB2 () {
		return R.compose(
			R.isEmpty, 
			R.prop('videoSrc')
		)(this)
	}
	isMissingIpfs () {
		return R.compose(
			R.isEmpty,
			R.prop('videoSrcHash')
		)(this)
	}
	isMissingThumbnail () {
		return R.compose(
			R.isEmpty,
			R.prop('thiccHash')
		)(this)
	}



	hasTmpFilePath () {
		return R.not(this.isMissingTmpFilePath());
	}
	hasB2 () {
		return R.not(this.isMissingB2());
	}
	hasLocalVideo () {
		return this.isMissingTmpFilePath
	}
	hasIpfs () {
		return R.compose(
			R.not,
			R.isEmpty,
			R.prop('videoSrcHash')
		)(this)
	}
	hasThumbnail () {
		return R.not(this.isMissingThumbnail());
	}



	/**
	 * Ensure that the VOD has a date.
	 */
	async ensureDate () {
		const action = this.getMethodToEnsureDate();
		if (action === null) return;
		await action.apply(this);
	}

	async ensureIpfs () {
		const actions = this.getMethodsToEnsureIpfs()
		for (const action of actions) {
			await action.apply(this);
		}
	}

	/**
	 * determineNecessaryActionsToEnsureComplete
	 */
	determineNecessaryActionsToEnsureComplete () {
		const actions = R.filter(R.is(Function), [
			this.getMethodToEnsureDate(),
			this.getMethodToEnsureThumbnail(),
			this.getMethodsToEnsureIpfs(),
		])
		return actions
	}

	/** 
	 * ensureComplete
	 *
	 * Ensure that a VOD entry has all required fields filled out.
	 *
	 * - ensure B2 file exists
	 * - ensure IPFS file exists
	 * - ensure thumbnail exists
	 * - ensure datestamp is in Zulu time
	 */
	async ensureComplete () {
		const actions = await this.determineNecessaryActionsToEnsureComplete();
		for (const action of actions) {
			await action.apply(this);
		}
	}


	async ensureTmpFilePath () {
		if (this.hasTmpFilePath()) return;
		const downloadMethod = this.getMethodToEnsureTmpFilePath();
		if (downloadMethod === null) {
			throw new VideoMissingError();
		}

		console.log(`  [D] ensureTmpFilePath() determined the DOWNLOAD METHOD to be: ${downloadMethod.name}`);

		await downloadMethod.apply(this);

		// sanity check for https://github.com/insanity54/futureporn/issues/66
		const stats = await fsp.stat(this.tmpFilePath);
		if (stats.isDirectory()) throw new Error('HALT THERE, CRIMINAL SCUM! The VOD\'s tmpFilePath is a directory which is a BUG. Please track down the culprit which is making a directory!!! See https://github.com/insanity54/futureporn/issues/66')
	}

	async ensureVideoSrc () {
		if (this.videoSrc !== '') return;
		await this.ensureTmpFilePath();
		const videoBasename = this._getVideoBasename('source');
		const url = await VOD._B2Upload(this.tmpFilePath);
		this.videoSrc = url;
	}

	async ensureVideoSrcHash () {
		if (this.videoSrcHash !== '') return;
		await this.ensureTmpFilePath();
		const videoBasename = this._getVideoBasename('source');
		const target = VOD._getTmpDownloadPath(videoBasename);
		if (this.isTmpFilePathMkv()) {
			console.log(`remuxing ${this.tmpFilePath} to ${target}`);
			const { exitCode, killed, stdout, stderr } = await execa('ffmpeg', ['-y', '-i', this.tmpFilePath, '-c', 'copy', target]);
			if (exitCode !== 0 || killed !== false) {
				throw new RemuxError(`exitCode:${exitCode}, killed:${killed}, stdout:${stdout}, stderr:${stderr}`);
			} else {
				this.tmpFilePath = target;
			}
		}
		if (this.isMissingTmpFilePath()) throw new TmpFilePathMissingError('tmpFilePath is missing prior to upload which should not occur')
		console.log(`~~~ uploading ${this.tmpFilePath} to IPFS ~~~`)
		const hash = await this._ipfsUpload(this.tmpFilePath);
		if (typeof hash === 'undefined') throw new UploadFailedError()
		this.videoSrcHash = `${hash}?filename=${videoBasename}`
		console.log('done')
	}

	async ensureVideo240Hash () {
		if (this.video240Hash !== '') return;
		await this.ensureTmpFilePath();
		const videoBasename = this._getVideoBasename('240p');
		const target = VOD._getTmpDownloadPath(videoBasename);
		console.log(`transcoding ${this.tmpFilePath} to ${target}`);
		const { exitCode, killed, stdout, stderr } = await execa('ffmpeg', ['-y', '-i', this.tmpFilePath, '-vf', 'scale=w=-2:h=240', '-b:v', '386k', '-b:a', '45k', target]);
		if (exitCode !== 0 || killed !== false) {
			throw new RemuxError(`exitCode:${exitCode}, killed:${killed}, stdout:${stdout}, stderr:${stderr}`);
		} else {
			this.video240HashTmp = target;
		}
		const hash = await this._ipfsUpload(this.video240HashTmp);
		if (typeof hash === 'undefined') throw new UploadFailedError()
		this.video240Hash = `${hash}?filename=${videoBasename}`
	}

	async remuxVideo () {
		if (R.isNil(this.tmpFilePath) || R.isEmpty(this.tmpFilePath)) throw new TmpFilePathMissingError();
		if (R.test(/\.mp4$/, this.tmpFilePath)) return;
		const videoBasename = this._getVideoBasename();
		const target = VOD._getTmpDownloadPath(videoBasename);
		console.log(`remuxing ${this.tmpFilePath} to ${target}`);
		const { exitCode, killed, stdout, stderr } = await execa('ffmpeg', ['-y', '-i', this.tmpFilePath, '-c', 'copy', target]);
		if (exitCode !== 0 || killed !== false) {
			throw new RemuxError(`exitCode:${exitCode}, killed:${killed}, stdout:${stdout}, stderr:${stderr}`);
		} else {
			this.tmpFilePath = target;
		}
	}


	static async _getBranchHash (rootCid, attempt = 0) {
		const cheerio = require('cheerio');

		try {
			attempt++;

		    // the web3.storage way of doing this is broken
		    // https://github.com/web3-storage/web3.storage/issues/840
		    // our workaround is to scrape the index via IPFS gateway
			const response = await fetch(`https://gateway.ipfs.io/ipfs/${rootCid}`);
			const body = await response.text();
			const $ = cheerio.load(body);
			const cidHref = $('a.ipfs-hash').attr('href');
			const cid = ipfsHashRegex.exec(cidHref)[0]

			return cid;


		} catch (e) {
			console.error(e);
			debug(`[!] _getBranchHash error at attempt ${attempt}`)
			if (attempt > 2) throw new Error(`_getBranchHash tried ${attempt} times but failed all times. Somethin' is probably broken or no internet or something liek that.`);
			else return VOD._getBranchHash(rootCid, attempt);
		}
	}

	async _ipfsUpload (filename, expiryDuration) {
		console.log('  [^] this upload provided by futureporn.net');
		return ipfsClusterUpload(filename, expiryDuration);
	}



	async uploadToIpfs () {
		if (typeof this === 'undefined') throw new Error('*this* is undefined in uploadToIpfs which is UNSUPPORTED. There is likely a problem with how you are calling uploadToIpfs()')
		if (R.isNil(this.tmpFilePath) || R.isEmpty(this.tmpFilePath)) throw new TmpFilePathMissingError();

		if (R.match(/\.mp4/, this.tmpFilePath)) {
			await this.encodeVideo();
		}

		console.log(`uploading ${this.tmpFilePath} to IPFS`);

		const hash = await this._ipfsUpload(this.tmpFilePath); 

		this.videoSrcHash = hash;
	}

	static async _B2Upload (filename) {
		console.log(`uploading ${filename} to B2`);
		if (process.env.B2_UPLOAD===0) {
			console.log('SKIPPING B2 upload due to B2_UPLOAD=0 set in env')
			return;
		}
		let unsuccessful = true;
		let url = '';
		let attempts = 0;
		while (unsuccessful) {
			attempts += 1
			// const { exitCode, killed } = await execa('rclone', ['copy', filename, `${VOD.rcloneDestination}:${VOD.B2BucketName}`]);
			const { exitCode, killed, stdout } = await execa('b2-linux', ['upload-file', 'futureporn', filename, path.basename(filename)]);
			console.log(stdout)
			if (exitCode === 0 && killed === false) {
				console.log('all good')
				unsuccessful = false;
				url = /URL by file name: (.*)$/m.exec(stdout)[1];
				console.log(`url->${url}`)
				break;
			}
			if (attempts === 3) {
				break;
			}
		}
		return url;
	}


	/**
	 * getDatestamp
	 * 
	 * normal behavior for date-fns is to process dates as local tz.
	 * we don't want that because all dates in futureporn are saved as GMT+0 time
	 * so we use date-fns-tz and format with timezone GMT
	 */
	getDatestamp () {
		const date = utcToZonedTime(this.date, 'UTC');
		const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", { timezone: 'UTC' });
		return formattedDate;
	}

	getSafeDatestamp () {
		if (R.isEmpty(this.date)) throw new DateMissingError();
		const date = utcToZonedTime(this.date, 'UTC');
		const formattedDate = format(date, "yyyyMMdd'T'HHmmss'Z'", { timezone: 'UTC' });
		return formattedDate;
	}

	_getVideoBasename (param) {
		if (R.isEmpty(this.date)) throw new DateMissingError();
		const d = this.getSafeDatestamp();
		const format = (R.isNil(param)) ? '' : `-${param}`;
		return `projektmelody-chaturbate-${d}${format}.mp4`;
	}


	getVideoFilename () {
		if (R.isEmpty(this.date)) throw new DateMissingError();
		return this._getVideoBasename();
	}

	getMarkdownFilename () {
		if (R.isEmpty(this.date)) throw new DateMissingError();
		const datestamp = this.getSafeDatestamp();
		return path.join(VOD.dataDir, `${datestamp}.md`);
	}


    mergeProperties (vod) {
        Object.keys(vod).forEach((key) => {
            if (key === 'date') return;
            this[key] = vod[key] || ""
        });
    }

	async loadMarkdown () {
		const filename = this.getMarkdownFilename();
		const rawData = await fsp.readFile(filename, { encoding: 'utf-8' });
		const { data } = matter(rawData);

		// prevent overwriting any existing k/v
		Object.keys(this).forEach((key) => {
			if (
				key !== 'date' && 
				key !== 'twitterThrottleTimer' &&
				key !== 'tags' && 
				this[key] !== ''
			) throw new Error(`  [d] loadMarkdown detected that this vod already has a key/value ${key}/${this[key]} which means loadMarkdown would overwrite the value. This is unsupported. Please make a VOD instance with only a date, then run loadMarkdown(). (or code new behavior)`)
		});

		this.mergeProperties(data);
	}

	async saveMarkdown () {
		let lines = [];
		lines.push('---');
		lines.push(`title: "${VOD._getSafeText(this.title)}"`);
		lines.push(`videoSrc: ${this.videoSrc}`);
		lines.push(`videoSrcHash: ${this.videoSrcHash}`);
		lines.push(`video720Hash: ${this.video720Hash}`);
		lines.push(`video480Hash: ${this.video480Hash}`);
		lines.push(`video360Hash: ${this.video360Hash}`);
		lines.push(`video240Hash: ${this.video240Hash}`);
		lines.push(`thinHash: ${this.thinHash}`);
		lines.push(`thiccHash: ${this.thiccHash}`);
		lines.push(`announceTitle: "${VOD._getSafeText(this.announceTitle)}"`);
		lines.push(`announceUrl: ${this.announceUrl}`);
		lines.push(`date: ${this.getDatestamp()}`);
		lines.push(`note: ${this.note}`);
		lines.push(`video240TmpFilePath: ${this.video240TmpFilePath}`);
		lines.push(`tmpFilePath: ${this.tmpFilePath}`);
		lines.push(`layout: ${VOD.eleventyLayout}`);
		lines.push(`tags:`);
		for (const tag of this.tags) {
			lines.push(`  - ${tag}`);
		}
		lines.push('---');
		lines.push('');
		const data = lines.join('\n');

		const filename = this.getMarkdownFilename();
		await fsp.writeFile(filename, data, { encoding: 'utf-8' });
		return this;
	}


	/**
	 * It's possible to call this function too quickly
	 * to the point where twitter drops the requests,
	 * so we put a throttle in here. Only one request to twitter per 5 seconds.
	 * we put a timestamp in this.twitterThrottleTimer
	 * and only make the next request if right now is 
	 */
	async getDateFromTwitter () {
		const lastRunAt = this.twitterThrottleTimer
		const now = Date.now();
		const delayRequired = 5000
		const nextRunAt = add(lastRunAt, delayRequired);
		const msTillNextRun = isAfter(now, nextRunAt) ? 0 : sub(now, nextRunAt) //(now > nextRunAt) ? 0 : (now - nextRunAt);
		debug(`  [getDateFromTwitter] Waiting until ${msTillNextRun} for next run.`);
	    await later(msTillNextRun, null); // throttle

		const tweetId = this.getTweetIdFromAnnounceUrl();
		const { data } = await VOD.twitter.get('tweets', { 
			ids: tweetId,
			'tweet.fields': 'created_at'
		});
		this.date = new Date(data[0].created_at);
		return this;
	}

	getTweetIdFromAnnounceUrl () {
		if (R.isEmpty(this.announceUrl)) throw new AnnouceUrlMissingError();
		return this.announceUrl.substring(this.announceUrl.lastIndexOf('/')+1);
	}

	async downloadFromB2 () {
		const localFilePath = VOD._getTmpDownloadPath(this._getVideoBasename());
		console.log(`  [*] downloading ${this.videoSrc} from B2 => ${localFilePath}`);
		const { killed, exitCode } = await execa('wget', ['-O', localFilePath, this.videoSrc ]);
		if (killed || exitCode !== 0) throw new Error(`killed:${killed}, exitCode:${exitCode}`)
		this.tmpFilePath = localFilePath;
		return this;
	}

	getIpfsUrl () {
		if (R.isEmpty(this.videoSrcHash)) throw new VideoSrcHashMissingError();
		if (R.isEmpty(this.date)) throw new DateMissingError();
		return `https://ipfs.io/ipfs/${this.videoSrcHash}?filename=${this._getVideoBasename()}`
	}

	async downloadFromIpfs () {
        console.log('  [*] downloadFromIpfs begin');
        const hash = VOD._getIpfsHash(this.videoSrcHash);
        const localFilePath = VOD._getTmpDownloadPath(this._getVideoBasename());
        const url = this.getIpfsUrl();
        const remoteVideoBasename = path.basename(url);
        console.log(`  [*] downloading ${remoteVideoBasename} (filepath:${localFilePath}) (hash:${hash}) from IPFS => ${localFilePath}`)
        const pro = execa('ipfs', ['-c', '/home/ipfs/.ipfs', 'get', '-o', localFilePath, hash]);
        const {stdout, stderr} = await pro;
        console.log('  [*] downloadFromIpfs  is done');
        console.log(stdout)
        console.error(stderr)
        this.tmpFilePath = localFilePath;
        return this;
	}



}




