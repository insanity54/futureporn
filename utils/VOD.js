
/**
 * VOD.js
 */

import dotenv from 'dotenv';
dotenv.config();

import * as R from 'ramda';
import execa from 'execa';
import * as os from 'os';
import * as fsp from 'fs/promises';
import path from 'path';
// import { formatISO, parseISO } from 'date-fns';
import { format, zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import fetch from 'node-fetch';
import Twitter from 'twitter-v2';

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
	static twitter = new Twitter({
		consumer_key:         process.env.TWITTER_API_KEY,
		consumer_secret:      process.env.TWITTER_API_KEY_SECRET
	})


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


	async copyIpfsToB2 () {
		await this.downloadFromIPFS();
		await this.uploadToB2();
	}

	async copyB2ToIpfs () {
		await this.downloadFromB2();
		await this.uploadToIpfs();
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

	getMethodToEnsureB2 () {
		this.ensureB2OrIpfs();
		const isActionRequired = R.and(this.isMissingB2(), this.hasIpfs());
		return isActionRequired ? this.copyIpfsToB2 : null;
	}


	getMethodToEnsureIpfs () {
		this.ensureB2OrIpfs();
		const isActionRequired = R.and(this.isMissingIpfs(), this.hasB2());
		return isActionRequired ? this.copyB2ToIpfs : null;
	}

	getMethodToEnsureThumbnail () {
		return this.isMissingThumbnail() ? this.generateThumbnail : null;
	}


	isMissingZuluDate () {
		return R.compose(
			R.or(
				R.isEmpty,
				R.not(R.match(/Z$/))
			),
			R.prop('date')
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
	hasB2 () {
		return R.not(this.isMissingB2());
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
	 * determineNecessaryActionsToEnsureComplete
	 */
	determineNecessaryActionsToEnsureComplete () {

		// if (this.isMissingB2() && this.isMissingIpfs()) {
		// 	console.warn(`WARNING: VOD ${this.date} is missing both B2 and IPFS!`)
		// }


		const actions = R.filter(R.is(Function), [
			this.getMethodToEnsureThumbnail(), // @TODO
			this.getMethodToEnsureIpfs(),
			this.getMethodToEnsureB2(),
			this.getMethodToEnsureDate(),
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


	/**
	 * getDatestamp
	 * 
	 * normal behavior for date-fns is to process dates as local tz.
	 * we don't want that because all dates in futureporn are saved as GMT+0 time
	 */
	getDatestamp () {
		console.log(this.date)
		const date = utcToZonedTime(this.date, 'GMT');
		const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", { timezone: 'GMT' });
		return formattedDate;
	}

	getVideoBasename () {
		if (R.isEmpty(this.date)) throw new DateMissingError();
		const d = this.getDatestamp();
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
		const date = utcToZonedTime(this.date, 'GMT');
		const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", { timezone: 'GMT' });
		return path.join(VOD.dataDir, `${formattedDate}.md`);
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

	async downloadFromIpfs () {
		const hash = this.videoSrcHash;
		const localFilePath = VOD.getTmpDownloadPath(hash);
		const url = `https://ipfs.io/ipfs/${hash}`;
		const res = {};
		res.execa = await execa('wget', ['-O', localFilePath, url], { stdio: 'inherit' })
		res.filename = localFilePath;
		this.tmpFilePath = localFilePath;
		return res;
	}



}



export default VOD