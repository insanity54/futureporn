
/**
 * vod.mjs
 */

import * as R from 'ramda';
import * as execa from 'execa';

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

		const isMissingB2 = R.compose(R.isEmpty, R.path('videoSrc'));
		const isMissingIpfs = R.compose(R.isEmpty, R.path('videoSrcHash'));
		const isMissingThumbnail = R.compose(R.isEmpty, R.path('thiccHash'));
		const hasB2 = R.not(isMissingB2);
		const hasIpfs = R.not(isMissingIpfs);
		const hasThumbnail = R.not(isMissingThumbnail);

		R.when(
			R.and(isMissingB2, isMissingIpfs),
			R.always(() => { throw new Error(`VOD ${this.date} is missing both B2 and IPFS`) })
		)(this)

		const ensureB2 = R.ifElse(
			R.and(isMissingB2, hasIpfs),
			R.always(this.copyIpfsToB2),
			R.always(null)
		)

		const ensureIpfs = R.ifElse(
			R.and(isMissingIpfs, hasB2),
			R.always(this.copyB2ToIpfs),
			R.always(null)
		)
		const actions = R.mapAccum(removeNulls, [], [
			ensureThumbnail,
			ensureIpfs,
			ensureB2
		])

		
		console.log('actions')
		console.log(actions)


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

	async downloadFromIPFS (hash, localFilePath) {
		if (typeof hash === 'undefined' || !hash ) throw new Error(`the hash was ${hash} and that's a no-no`);
		if (typeof localFilePath === 'undefined') throw new Error(`the localFilePath was undefined and that's a no-no`);
		console.log(`downloading hash:${hash} from ipfs to localFilePath:${localFilePath}`)
		const url = `https://ipfs.io/ipfs/${hash}`;
		return execa('wget', ['-O', localFilePath, url], { stdio: 'inherit' })
	}



}



(async function () {
	const v = new VOD({});
	await v.ensureComplete();
})()
