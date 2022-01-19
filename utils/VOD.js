
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
const dateFnsTz = require('date-fns-tz');
const fetch = require('node-fetch');
const Twitter = require('twitter-v2');
const { Web3Storage, getFilesFromPath } = require('web3.storage');
const Prevvy = require('prevvy');
const { fileURLToPath } = require('url');
const { format, zonedTimeToUtc, utcToZonedTime } = dateFnsTz;
const ipfsHashRegex = /Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,}/;


// const __dirname = fileURLToPath(path.dirname(import.meta.url)); // esm workaround for missing __dirname

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
	static web3Client = new Web3Storage({ token: VOD.web3Token });

	// greetz https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
	static fixedEncodeURIComponent(str) {
	  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
	    return '%' + c.charCodeAt(0).toString(16);
	  });
	}

	// greetz https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent
	static _containsEncodedComponents(x) {
	  return /%[0-9a-fA-F]+/.test(x);
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
		const tmpDir = path.join(os.homedir(), 'futureporn_tmp');
		return path.join(tmpDir, filename);
	}

	static _parseDate (date) {
		if (R.isEmpty(date)) return '';
		if (R.isNil(date)) return '';
		if (R.is(Date, date)) return date;
		if (R.is(String, date)) return zonedTimeToUtc(date, 'Zulu');
	}


	async ensureThiccHash () {
		debug(this)
		if (this.thiccHash !== '') return;
		if (this.tmpFilePath === '') {
			debug('video is missing so im gonna throw')
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
		await downloadMethod.apply(this);
	}

	async ensureVideoSrc () {
		if (this.videoSrc !== '') return;
		await this.ensureTmpFilePath();
		const videoBasename = this._getVideoBasename('source');
		const url = await this._B2Upload(this.tmpFilePath);
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
		console.log(`~~~ uploading ${this.tmpFilePath} to web3 (IPFS) ~~~`)
		const hash = await this._ipfsUpload(this.tmpFilePath);
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

	async _ipfsUpload (filename) {
		const token = process.env.WEB3_TOKEN;
		if (typeof token === 'undefined') {
			throw new Error('A token is needed. (WEB3_TOKEN in env must be defined). You can create one on https://web3.storage. ')
		}
		const storage = new Web3Storage({ token })
		const files = await getFilesFromPath(filename);


		async function __upload (storage, files, attempt = 0) {
		  try {
		    attempt++;

		    debug(`[^] uploading ${files.map(f => f.name)}`);
		    const rootCid = await storage.put(files)

		    debug(`[^] Upload complete. The rootCid is ${rootCid}`);
		    return rootCid;

		  } catch (e) {
		    console.error(e);
		    debug(`[^] upload error at attempt ${attempt}. trying again.`);

		    if (attempt > 2) throw new Error(`Upload failed. Tried ${attempt} times.`);
		    else return __upload(storage, files, attempt);
		  }
		}

		const rootCid = await __upload(storage, files);
		const cid = await VOD._getBranchHash(rootCid);
		return cid;
	}

	async uploadToIpfs () {
		if (typeof this === 'undefined') throw new Error('*this* is undefined in uploadToIpfs which is UNSUPPORTED. There is likely a problem with how you are calling uploadToIpfs()')
		if (R.isNil(this.tmpFilePath) || R.isEmpty(this.tmpFilePath)) throw new TmpFilePathMissingError();
		if (os.totalmem() < 17179870000) throw new NotEnoughMemoryError('>=16GB is required for this task.');

		if (R.match(/\.mp4/, this.tmpFilePath)) {
			await this.encodeVideo();
		}

		console.log(`uploading ${this.tmpFilePath} to IPFS`);
		if (typeof VOD.web3Token === 'undefined') {
			throw new Error('A web3.storage token "token" must be passed in options object, but token was undefined.')
		}

		const hash = await this._ipfsUpload(this.tmpFilePath);

		this.videoSrcHash = hash;
	}

	async _B2Upload (filename) {
		console.log(`uploading ${filename} to B2`);
		if (process.env.B2_UPLOAD===0) {
			console.log('SKIPPING B2 upload due to B2_UPLOAD=0 set in env')
			return;
		}
		let unsuccessful = true;
		let attempts = 0;
		while (unsuccessful) {
			attempts += 1
			const { exitCode, killed } = await execa('rclone', ['copy', filename, `${VOD.rcloneDestination}:${VOD.B2BucketName}`]);
			if (exitCode === 0 && killed === false) {
				unsuccessful = false;
			}
			if (attempts === 3) {
				break;
			}
		}
		const url = await this._getB2UrlFromB2(path.basename(filename));
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

	async _getB2UrlFromB2 (filename) {
		let unsuccessful = true;
		let attempts = 0;
		let output = '';
		while (unsuccessful) {
			attempts += 1;
			const { exitCode, killed, stdout } = await execa('rclone', [
				'link', 
				`${VOD.rcloneDestination}:${VOD.B2BucketName}/${filename}`
			])

			if (exitCode === 0 && killed === false) {
				unsuccessful = false;
				output = stdout;
			}

			if (attempts === 3) {
				break;
			}
		}
		return output;
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



	async saveMarkdown () {
		const data = '---\n'+
			`title: "${VOD._getSafeText(this.title)}"\n`+
			`videoSrc: ${this.videoSrc}\n`+
			`videoSrcHash: ${this.videoSrcHash}\n`+
			`video720Hash: ${this.video720Hash}\n`+
			`video480Hash: ${this.video480Hash}\n`+
			`video360Hash: ${this.video360Hash}\n`+
			`video240Hash: ${this.video240Hash}\n`+
			`thinHash: ${this.thinHash}\n`+
			`thiccHash: ${this.thiccHash}\n`+
			`announceTitle: "${VOD._getSafeText(this.announceTitle)}"\n`+
			`announceUrl: ${this.announceUrl}\n`+
			`date: ${this.getDatestamp()}\n`+
			`note: ${this.note}\n`+
			`video240TmpFilePath: ${this.video240TmpFilePath}\n`+
			`tmpFilePath: ${this.tmpFilePath}\n`+
			`layout: ${VOD.eleventyLayout}\n`+
			'---\n';

		const filename = this.getMarkdownFilename();
		await fsp.writeFile(filename, data, { encoding: 'utf-8' });
		return this;
	}

	async getDateFromTwitter () {
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
		const remoteVideoBasename = path.basename(this.videoSrc);
		console.log(`downloading ${remoteVideoBasename} from B2 => ${localFilePath}`);
		const { killed, exitCode } = await execa('rclone', ['copyto', `${VOD.rcloneDestination}:${VOD.B2BucketName}/${remoteVideoBasename}`, localFilePath ], { stdio: 'inherit' });
		console.log(`killed:${killed}, exitCode:${exitCode}`)
		this.tmpFilePath = localFilePath;
		return this;
	}

	getIpfsUrl () {
		if (R.isEmpty(this.videoSrcHash)) throw new VideoSrcHashMissingError();
		if (R.isEmpty(this.date)) throw new DateMissingError();
		return `https://ipfs.io/ipfs/${this.videoSrcHash}?filename=${this._getVideoBasename()}`
	}

	async downloadFromIpfs () {
		const hash = VOD._getIpfsHash(this.videoSrcHash);
		const localFilePath = VOD._getTmpDownloadPath(this._getVideoBasename());
		const url = this.getIpfsUrl();
		const remoteVideoBasename = path.basename(url);
		console.log(`downloading ${remoteVideoBasename} from IPFS => ${localFilePath}`)
		//await execa('wget', ['-O', localFilePath, url], { stdio: 'inherit' })
		await execa('ipfs', ['get', '-o', localFilePath, hash])
		this.tmpFilePath = localFilePath;
		return this;
	}



}



