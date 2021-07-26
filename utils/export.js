
const path = require('path');
const globby = require('globby');
const matter = require('gray-matter');
const fsp = require('fs').promises;
const execa = require('execa');
const { format } = require('date-fns');

const getVodsAsJson = async () => {
	let list = [];
	const vods = await globby(path.join(__dirname, '../website/vods/*.md'));
	for (vod of vods) {
		const content = await fsp.readFile(vod, { encoding: 'utf-8' });
		const data = await matter(content)
		list.push(data)
	}
	return list
}




const withoutBB2 = (vod) => {
	return (typeof vod.data.videoSrc === 'undefined' || !vod.data.videoSrc)
}

const withIPFS = (vod) => {
	return (typeof vod.data.videoSrcHash !== 'undefined' && vod.data.videoSrcHash);
}

const withoutBB2andWithIPFS = (vod) => {
	return (withoutBB2(vod) && withIPFS(vod))
}


const uploadToBB2 = async (bucketName, localFilePath, b2FileName) => {
	return execa('b2-linux', ['upload-file', bucketName, localFilePath, b2FileName])
		.then(() => {
			return execa('b2-linux', ['make-friendly-url', bucketName, b2FileName])
		})
		.then((res) => {
			if (!res.stdout.startsWith('https://')) throw new Error(`the output of b2-linux make-friendly-url was not a URL. it was ${res.stdout} which is unexpected!`);
			return res.stdout
		})
}

const downloadFromIPFS = async (hash, localFilePath) => {
	if (typeof hash === 'undefined' || !hash ) throw new Error(`the hash was ${hash} and that's a no-no`);
	if (typeof localFilePath === 'undefined') throw new Error(`the localFilePath was undefined and that's a no-no`);
	console.log(`downloading hash:${hash} from ipfs to localFilePath:${localFilePath}`)
	const url = `https://ipfs.io/ipfs/${hash}`;
	return execa('wget', ['-O', localFilePath, url], { stdio: 'inherit' })
}

const addBB2toMarkdown = async (bb2lessVods, videoSrcHash, bb2Url) => {

	const matchingDocument = bb2lessVods.find((vod) => vod.videoSrcHash === videoSrcHash);
	console.log(`matching doc is as follows`)
	console.log(matchingDocument);

	const data = await matter(matchingDocument)
	console.log(`parsed data is as follows`)
	console.log(data);

	const string = data.stringify();
	console.log(`string is as follows`)
	console.log(string);

}



(async () => {

	const vods = await getVodsAsJson();
	const bb2lessVods = vods.filter(withoutBB2andWithIPFS);

	console.log(bb2lessVods)

	for await (vod of bb2lessVods) {
		const { date, videoSrcHash } = vod.data;
		const formattedDate = format(date, 'yyyy-MM-dd')
		console.log(`processing vod from ${formattedDate}`)
		const fileName = `projektmelody-chaturbate-${formattedDate}.mp4`;
		const pathOnDisk = `/tmp/${fileName}`;

		try {
			await downloadFromIPFS(videoSrcHash, pathOnDisk);
			const bb2Url = await uploadToBB2('futureporn', pathOnDisk, fileName);
			await addBB2toMarkdown(bb2lessVods, videoSrcHash, bb2Url);
			await execa('rm', [pathOnDisk], { stdio: 'inherit' });
		} catch (e) {
			console.error('problem while downloading from IPFS or uploading to BB2. Error is as follows.');
			console.error(e);
		}
	}
})()