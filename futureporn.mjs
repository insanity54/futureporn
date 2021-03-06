


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

		vods.push(v);
	}

	// // create VOD object for each VOD *.mp4 file in the workdir (created by voddo)
	// const videoFiles = await fg([ workDirPattern ]);
	// for (const videoFile of videoFiles) {
	// 	const v = new VOD({ videoSrcTmp: videoFile });
	// 	vods.push(v);
	// }

	console.log(`There are ${vods.length} known VODs`);
	// process latest vods first
	vods.reverse()

	for (const vod of vods) {

		console.log(`vod:${vod.getDatestamp()} processing begin`);

		const ensuranceFunctions = [
			// vod.ensureAnnounceUrl,   // idk why I commented this out
			// vod.ensureAnnounceTitle, // idk why I commented this out
			vod.ensureDate,             // get the date from twitter
			//vod.ensureAudioOnly,      // feature creep
			vod.ensureVideoSrc,         // make sure the VOD is uploaded to B2
			vod.saveMarkdown,           // why is saveMarkdown run after every ensure function? I forget why I did this but I think it might be important
			vod.ensureVideoSrcHash,     // make sure the VOD is uploaded to IPFS
			vod.saveMarkdown,           //
			vod.ensureVideo240Hash,     // encode a 240p version of the VOD
			// vod.ensureVideo480Hash,  // coming soon (TM)
			vod.ensureThiccHash,        // create a thumbnail
			vod.ensureTextFormatting,   // fix any erroneus text
			vod.saveMarkdown,           //
		];


		for (const f of ensuranceFunctions) {
			try {
				await f.apply(vod);
			} catch (e) {
				console.warn(e);
			}
		}

		console.log(`vod:${vod.getDatestamp()} complete`)


		// process.exit()
	}

})()
