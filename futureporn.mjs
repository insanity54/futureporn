


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
	vods.reverse();

	let errorCount = [];

	for (const vod of vods) {

		// console.log(`  [*] vod:${vod.getDatestamp()} processing begin`);

		const ensuranceFunctions = [
			// vod.ensureAnnounceUrl,   // idk why I commented this out
			// vod.ensureAnnounceTitle, // idk why I commented this out
			vod.ensureCidV1,            // no more Qm! https://github.com/insanity54/futureporn/issues/64
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

				errorCount += 1;

				// we want to delete VOD.tmpFilePath if the tmpFilePath is not valid.
				// we do this because we have not been cleaning up after ourselves on this field
				// we have a bunch of paths on disk that are irrelevant in production capture/manager/worker environments.
				// we only want to delete the tmpFilePath if the referenced video is actually absent,
				// so we check for Permission denied (we see this on local dev laptop when referencing /root/... file paths that are only valid on VPS)
				// we also check for FileNotFoundErrors 
				if (e?.stderr) {
					if (
						/Permission denied/.test(e.stderr) ||
						/FileNotFoundError/.test(e.stderr) ||
						/No such file or directory/.test(e.stderr)
					) {
						console.log('  !!! VOD.tmpFilePath is not valid so we are deleting it.');
						vod.tmpFilePath = '';
						await vod.saveMarkdown();
					}
				}
				console.log('  [*********] CAUGHT AN ERROR:')
				console.error(e);
				if (e.type === 'FileNotFoundError') {
					console.error('EYYYYYYY\nEYYYYYYY\nEYYYYYYY\nEYYYYYYY\nEYYYYYYY\nEYYYYYYY\nEYYYYYYY\nEYYYYYYY\nEYYYYYYY\nEYYYYYYY\n')
				}
			}
		}

		// console.log(`  [*] vod:${vod.getDatestamp()} complete`)

	}

	console.log(`  [$] Completed with ${errorCount.length} errors.`);

})()
