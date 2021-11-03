
/**
 * VOD.js
 */

require('dotenv').config();

const R = require('ramda');
const execa = require('execa');
const os = require('os');
const fsp = require('fs/promises');
const path = require('path');
const { format, zonedTimeToUtc, utcToZonedTime } = require('date-fns-tz');
const fetch = require('node-fetch');
const Twitter = require('twitter-v2');
const { Web3Storage, getFilesFromPath } = require('web3.storage');


class TranscodeError extends Error {
	constructor (message) {
		super(R.defaultTo('transcode error')(message));
		this.name = 'TranscodeError';
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



class VOD {
	
	constructor (data) {
		if (typeof data === 'undefined') throw new Error('VOD() constructor must receive a data object')
		this.date = VOD.parseDate(data.date);
		this.title = VOD.default(data.title);
		this.videoSrc = VOD.default(data.videoSrc);
		this.videoSrcTmp = VOD.default(data.videoSrcTmp);
		this.videoSrcHash = VOD.default(data.videoSrcHash);
		this.video720Hash = VOD.default(data.video720Hash);
		this.video480Hash = VOD.default(data.video480Hash);
		this.video360Hash = VOD.default(data.video360Hash);
		this.thinHash = VOD.default(data.thinHash);
		this.thiccHash = VOD.default(data.thiccHash);
		this.announceTitle = VOD.default(data.announceTitle);
		this.announceUrl = VOD.default(data.announceUrl);
		this.note = VOD.default(data.note);
		this.layout = VOD.default(data.layout);
		this.tmpFilePath = VOD.default(data.tmpFilePath);
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
	static getSafeText (text) {
		return text.replace(/"/g, '\\"')
	}

	static getTmpDownloadPath (filename) {
		const tmpDir = os.tmpdir();
		return path.join(tmpDir, filename);
	}

	static parseDate (date) {
		if (R.isEmpty(date)) return '';
		if (R.isNil(date)) return '';
		if (R.is(Date, date)) return date;
		if (R.is(String, date)) return zonedTimeToUtc(date, 'Zulu');
	}


	async generateThumbnail () {
		setTimeout(() => {
			// @TODO no-op for now. Later on I want to actually generate a thumbnail.
			return '';
		}, 250);
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
		if(R.and(this.isMissingTmpFilePath(), this.hasIpfs())) return this.downloadFromIpfs;
		if(R.and(this.isMissingTmpFilePath(), this.hasB2())) return this.downloadFromB2;
		return null;
	}

	getMethodToEnsureB2 () {
		return this.isMissingB2() ? this.uploadToB2 : null;
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


	async ensureIpfs () {
		const actions = this.getMethodsToEnsureIpfs()
		for (const action of actions) {
			await action.call(this);
		}
	}

	/**
	 * determineNecessaryActionsToEnsureComplete
	 */
	determineNecessaryActionsToEnsureComplete () {
		const actions = R.filter(R.is(Function), [
			this.getMethodToEnsureDate(),
			this.getMethodToEnsureTmpFilePath(),
			this.getMethodToEnsureEncode(),
			this.getMethodToEnsureThumbnail(),
			this.getMethodsToEnsureIpfs(),
			this.getMethodToEnsureB2(),
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

	async encodeVideo () {
		if (R.isNil(this.tmpFilePath) || R.isEmpty(this.tmpFilePath)) throw new TmpFilePathMissingError();
		if (R.test(/\.mp4$/, this.tmpFilePath)) return;
		const videoBasename = this.getVideoBasename();
		const target = VOD.getTmpDownloadPath(videoBasename);
		console.log(`transcoding ${this.tmpFilePath} to ${target}`);
		const { exitCode, killed, stdout, stderr } = await execa('ffmpeg', ['-y', '-i', this.tmpFilePath, target]);
		if (exitCode !== 0 || killed !== false) {
			throw new TranscodeError(`exitCode:${exitCode}, killed:${killed}, stdout:${stdout}, stderr:${stderr}`);
		} else {
			this.tmpFilePath = target;
		}
	}

	async uploadToIpfs () {
		if (typeof this === 'undefined') throw new Error('*this* is undefined in uploadToIpfs which is UNSUPPORTED. There is likely a problem with how you are calling uploadToIpfs()')
		if (R.isNil(this.tmpFilePath) || R.isEmpty(this.tmpFilePath)) throw new TmpFilePathMissingError();

		if (R.match(/\.mp4/, this.tmpFilePath)) {
			await this.encodeVideo();
		}

		console.log(`uploading ${this.tmpFilePath} to IPFS`);
		if (typeof VOD.web3Token === 'undefined') {
			throw new Error('A web3.storage token "token" must be passed in options object, but token was undefined.')
		}
		const files = await getFilesFromPath(this.tmpFilePath);
		const rootCid = await VOD.web3Client.put(files);

		// Fetch and verify files from web3.storage
		const res = await VOD.web3Client.get(rootCid); // Promise<Web3Response | null>
		const ipfsFiles = await res.files(); // Promise<Web3File[]>

		this.videoSrcHash = ipfsFiles[0].cid;
		console.log(this.videoSrcHash);
	}

	async uploadToB2 () {
		console.log(`uploading ${this.tmpFilePath} to B2`);
		if (process.env.B2_UPLOAD===0) {
			console.log('SKIPPING B2 upload due to B2_UPLOAD=0 set in env')
			return;
		}
		let unsuccessful = true;
		let attempts = 0;
		while (unsuccessful) {
			attempts += 1
			const { exitCode, killed } = await execa('rclone', ['copy', this.tmpFilePath, `${VOD.rcloneDestination}:${VOD.B2BucketName}`]);
			if (exitCode === 0 && killed === false) {
				unsuccessful = false;
			}
			if (attempts === 3) {
				break;
			}
		}
		this.videoSrc = await this.getB2UrlFromB2();
		return this;
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
		const date = utcToZonedTime(this.date, 'UTC');
		const formattedDate = format(date, "yyyyMMdd'T'HHmmss'Z'", { timezone: 'UTC' });
		return formattedDate;
	}

	getVideoBasename () {
		if (R.isEmpty(this.date)) throw new DateMissingError();
		const d = this.getSafeDatestamp();
		return `projektmelody-chaturbate-${d}.mp4`;
	}

	async getB2UrlFromB2 () {
		let unsuccessful = true;
		let attempts = 0;
		let output = '';
		let filename = this.getVideoBasename();
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
		return this.getVideoBasename();
	}

	getMarkdownFilename () {
		if (R.isEmpty(this.date)) throw new DateMissingError();
		const datestamp = this.getSafeDatestamp();
		return path.join(VOD.dataDir, `${datestamp}.md`);
	}



	async saveMarkdown () {
		const data = '---\n'+
			`title: "${VOD.getSafeText(this.title)}"\n`+
			`videoSrc: ${this.videoSrc}\n`+
			`videoSrcHash: ${this.videoSrcHash}\n`+
			`video720Hash: ${this.video720Hash}\n`+
			`video480Hash: ${this.video480Hash}\n`+
			`video360Hash: ${this.video360Hash}\n`+
			`thinHash: ${this.thinHash}\n`+
			`thiccHash: ${this.thiccHash}\n`+
			`announceTitle: "${VOD.getSafeText(this.announceTitle)}"\n`+
			`announceUrl: ${this.announceUrl}\n`+
			`date: ${this.getDatestamp()}\n`+
			`note: ${this.note}\n`+
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
		const localFilePath = VOD.getTmpDownloadPath(this.getVideoBasename());
		const remoteVideoBasename = path.basename(this.videoSrc);
		console.log(`downloading ${remoteVideoBasename} from B2 => ${localFilePath}`);
		const { killed, exitCode } = await execa('rclone', ['copy', `${VOD.rcloneDestination}:${VOD.B2BucketName}/${remoteVideoBasename}`, localFilePath ], { stdio: 'inherit' });
		console.log(`killed:${killed}, exitCode:${exitCode}`)
		this.tmpFilePath = localFilePath;
		return this;
	}

	getIpfsUrl () {
		if (R.isEmpty(this.videoSrcHash)) throw new VideoSrcHashMissingError();
		if (R.isEmpty(this.date)) throw new DateMissingError();
		return `https://ipfs.io/ipfs/${this.videoSrcHash}?filename=${this.getVideoBasename()}`
	}

	async downloadFromIpfs () {
		const hash = this.videoSrcHash;
		const localFilePath = VOD.getTmpDownloadPath(this.getVideoBasename());
		const url = this.getIpfsUrl();
		const remoteVideoBasename = path.basename(url);
		console.log(`downloading ${remoteVideoBasename} from IPFS => ${localFilePath}`)
		await execa('wget', ['-O', localFilePath, url], { stdio: 'inherit' })
		this.tmpFilePath = localFilePath;
		return this;
	}



}



module.exports = VOD;