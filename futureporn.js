


const VOD = require('./utils/VOD.js');
const fg = require('fast-glob');
const path = require('path');
const fsp = require('fs/promises');
const marked = require('gray-matter');

const workDir = __dirname // esm style which I'm avoiding for now: path.dirname(import.meta.url);
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
		// console.log(`VOD found with date:${v.date}`);
		vods.push(v);
	}

	// create VOD object for each VOD *.mp4 file in the workdir (created by voddo)
	const videoFiles = await fg([ workDirPattern ]);
	for (const videoFile of videoFiles) {
		const v = new VOD({ videoSrcTmp: videoFile });
		vods.push(v);
	}

	console.log(`There are ${vods.length} known VODs`);

	for (const vod of vods) {
		console.log(`vod:${vod.date}`)

		try {
			// await vod.getDateFromTwitter()
			await vod.ensureComplete()
			await vod.saveMarkdown()
		} catch (e) {
			console.warn(e)
		}
	}

})()