
/**
 * VOD.js
 */

import * as R from 'ramda';
import execa from 'execa';
import * as os from 'os';
import * as fsp from 'fs/promises';
import * as path from 'path';
import { format, parseISO } from 'date-fns';

class DateMissingError extends Error {
	constructor (message) {
		super(R.defaultTo('date is missing from VOD which is UNSUPPORTED')(message));
		this.name = 'DateMissingError';
	}
}

class VOD {
	
	constructor (data) {
		if (typeof data === 'undefined') throw new Error('VOD() constructor must receive a data object')
		const defaultToEmptyString = R.defaultTo('');
		this.date = parseISO(defaultToEmptyString(data.date));
		this.title = defaultToEmptyString(data.title);
		this.videoSrc = defaultToEmptyString(data.videoSrc);
		this.videoSrcTmp = defaultToEmptyString(data.videoSrcTmp);
		this.videoSrcHash = defaultToEmptyString(data.videoSrcHash);
		this.video720Hash = defaultToEmptyString(data.video720Hash);
		this.video480Hash = defaultToEmptyString(data.video480Hash);
		this.video360Hash = defaultToEmptyString(data.video360Hash);
		this.thinHash = defaultToEmptyString(data.thinHash);
		this.thiccHash = defaultToEmptyString(data.thiccHash);
		this.announceTitle = defaultToEmptyString(data.announceTitle);
		this.announceUrl = defaultToEmptyString(data.announceUrl);
		this.note = defaultToEmptyString(data.note);
		this.layout = defaultToEmptyString(data.layout);
		this.tmpFilePath = defaultToEmptyString(data.tmpFilePath);
	}
	

	static B2BucketName = 'futureporn';
	static rcloneDestination = 'b2';
	static dataDir = path.join(__dirname, '..', 'website', 'vods');
	static eleventyLayout = 'layouts/vod.njk';

	static getTmpDownloadPath (filename) {
		const tmpDir = os.tmpdir();
		return path.join(tmpDir, filename);
	}


	async copyIpfsToB2 () {
		await this.downloadFromIPFS();
		await this.uploadToB2();
	}

	async copyB2ToIpfs () {
		await this.downloadFromB2();
		await this.uploadToIpfs();
	}


	ensureB2OrIpfs () {
		const fault = R.and(this.isMissingB2(), this.isMissingIpfs());
		if (fault) throw new Error('neither b2 nor ipfs link exists on this VOD, which is UNSUPPORTED');
	}

	getMethodToEnsureB2 () {
		this.ensureB2OrIpfs();
		const act = R.and(this.isMissingB2(), this.hasIpfs());
		return act ? this.copyIpfsToB2 : null;
	}


	getMethodToEnsureIpfs () {
		this.ensureB2OrIpfs();
		const act = R.and(this.isMissingIpfs(), this.hasB2());
		return act ? this.copyB2ToIpfs : null;
	}

	getMethodToEnsureThumbnail () {
		const act = R.and(this.isMissingThumbnail(), this.hasIpfs());
		return act ? this.generateThumbnail : null;
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
		)
	}
	hasB2 () {
		return R.not(this.isMissingB2());
	}
	hasIpfs () {
		return R.compose(
			R.not,
			R.isEmpty,
			R.prop('videoSrcHash')
		)
	}
	hasThumbnail () {
		return R.not(this.isMissingThumbnail());
	}


	/**
	 * determineNecessaryActionsToEnsureComplete
	 */
	async determineNecessaryActionsToEnsureComplete () {



		R.when(
			R.and(this.isMissingB2(), this.isMissingIpfs()),
			R.always(() => { throw new Error(`VOD ${this.date} is missing both B2 and IPFS`) })
		)(this)



		const actions = R.mapAccum(removeNulls, [], [
			this.getMethodToEnsureThumbnail,
			this.getMethodToEnsureIpfs,
			this.getMethodToEnsureB2
		])

		
		console.log('actions')
		console.log(actions)


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
	 */
	async ensureComplete () {
		const actions = this.determineNecessaryActionsToEnsureComplete();
		await actions();
	}


	async uploadToB2 () {
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


	async getB2UrlFromB2 () {
		let unsuccessful = true;
		let attempts = 0;
		let output = '';
		let filename = this.getFilename();
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
		return `projektmelody-chaturbate-${this.date}.mp4`;
	}

	getMarkdownFilename () {
		if (R.isEmpty(this.date)) throw new DateMissingError();
		const markdownFilePath = path.join(VOD.dataDir, `${this.date}.md`);
		return markdownFilePath;
	}

	async saveMarkdown () {
		const data = '---\n'+
			`title: ${this.title}\n`+
			`videoSrc: ${this.videoSrc}\n`+
			`videoSrcHash: ${this.videoSrcHash}\n`+
			`video720Hash: ${this.video720Hash}\n`+
			`video480Hash: ${this.video480Hash}\n`+
			`video360Hash: ${this.video360Hash}\n`+
			`thinHash: ${this.thinHash}\n`+
			`thiccHash: ${this.thiccHash}\n`+
			`announceTitle: ${this.announceTitle}\n`+
			`announceUrl: ${this.announceUrl}\n`+
			`date: ${format(this.date, 'yyyy-MM-dd')}\n`+
			`note: ${this.note}\n`+
			`layout: ${VOD.eleventyLayout}\n`+
			'---\n';

		await fsp.writeFile(this.getMarkdownFilename(), data, { encoding: 'utf-8' });
		return this;
	}

	async downloadFromIpfs () {
		const hash = this.videoSrcHash;
		const localFilePath = VOD.getTmpDownloadPath(hash);
		console.log(`downloading hash:${hash} from ipfs to localFilePath:${localFilePath}`)
		const url = `https://ipfs.io/ipfs/${hash}`;
		const res = {};
		res.execa = await execa('wget', ['-O', localFilePath, url], { stdio: 'inherit' })
		res.filename = localFilePath;
		this.tmpFilePath = localFilePath;
		return res;
	}



}



export default VOD