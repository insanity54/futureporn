


import VOD from './utils/VOD.js';
import fg from 'fast-glob';
import path from 'path';
import fsp from 'fs/promises';
import marked from 'gray-matter';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(path.dirname(import.meta.url)); // esm workaround for missing __dirname
const workDir = __dirname; 
const workDirPattern = path.join(workDir, '*.mp4');
const vodDir = path.join(workDir, 'website', 'vods');
const vodDirPattern = path.join(vodDir, `*.md`);

console.log(`
	workDir: ${workDir}
	workDirPattern: ${workDirPattern}
	vodDir: ${vodDir}
	vodDirPattern: ${vodDirPattern}
`);


(async function main() {
	let vods = [];

	// create VOD object for each VOD markdown file
	const markdownFiles = await fg([ vodDirPattern ]);
	console.log(markdownFiles)
	for (const markdownFile of markdownFiles) {
		const mdRaw = await fsp.readFile(markdownFile);
		const { data } = await marked(mdRaw);
		const v = new VOD(data);
		console.log(`VOD found with date:${v.date}`);

		if (
			v.videoSrcHash === '' &&
			v.tmpFilePath !== ''
		) vods.push(v);
	}

	// create VOD object for each VOD *.mp4 file in the workdir (created by voddo)
	const videoFiles = await fg([ workDirPattern ]);
	for (const videoFile of videoFiles) {
		const v = new VOD({ videoSrcTmp: videoFile });
		vods.push(v);
	}

	console.log(`There are ${vods.length} known VODs`);

	for (const vod of vods) {

		console.log(`vod:${vod.getDatestamp()} processing begin`);

		try {
			await vod.generateThumbnail();
			await vod.saveMarkdown();
			await vod.ensureIpfs();
			await vod.saveMarkdown();
		} catch (e) {
			console.warn(e);
		}

		console.log(`vod:${vod.getDatestamp()} complete`)
	}

})()