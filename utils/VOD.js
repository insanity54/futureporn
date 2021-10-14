
/**
 * VOD.js
 */

import * as R from 'ramda';
import * as execa from 'execa';
import * as os from 'os';
import * as fs from 'fs/promises';
import * as path from 'path';

class VOD {
	
	constructor (data) {
		if (typeof data === 'undefined') throw new Error('VOD() constructor must receive a data object')
		const defaultToEmptyString = R.defaultTo('');
		this.date = defaultToEmptyString(data.date);
		this.title = defaultToEmptyString(data.title);
		this.videoSrc = defaultToEmptyString(data.videoSrc);
		this.videoSrcHash = defaultToEmptyString(data.videoSrcHash);
		this.video720Hash = defaultToEmptyString(data.video720Hash);
		this.video480Hash = defaultToEmptyString(data.video480Hash);
		this.video360Hash = defaultToEmptyString(data.video360Hash);
		this.thinHash = defaultToEmptyString(data.thinHash);
		this.thiccHash = defaultToEmptyString(data.thiccHash);
		this.announceTitle = defaultToEmptyString(data.announceTitle);
		this.announceUrl = defaultToEmptyString(data.announceUrl);
		this.date = defaultToEmptyString(data.date);
		this.layout = defaultToEmptyString(data.layout);
	}
	

	static B2BucketName = 'futureporn';


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


	async uploadToBB2 (bucketName, localFilePath, b2FileName) {
		return execa('b2-linux', ['upload-file', bucketName, localFilePath, b2FileName])
			.then(() => {
				return execa('b2-linux', ['make-friendly-url', bucketName, b2FileName])
			})
			.then((res) => {
				if (!res.stdout.startsWith('https://')) throw new Error(`the output of b2-linux make-friendly-url was not a URL. it was ${res.stdout} which is unexpected!`);
				return res.stdout
			})
	}



	async downloadFromIpfs () {

		const hash = this.videoSrcHash;
		const localFilePath = VOD.getTmpDownloadPath(hash);

		console.log(`downloading hash:${hash} from ipfs to localFilePath:${localFilePath}`)
		const url = `https://ipfs.io/ipfs/${hash}`;
		return execa('wget', ['-O', localFilePath, url], { stdio: 'inherit' })
	}



}



export default VOD