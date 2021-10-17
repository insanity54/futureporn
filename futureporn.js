


import VOD from './utils/VOD.js';
import fg from 'fast-glob';
import path from 'path';
import * as fsp from 'fs/promises';
import marked from 'gray-matter';

const workDir = path.resolve(path.dirname(''));
const workDirPattern = path.join(workDir, '*.mp4');
const vodDir = path.join(workDir, 'website', 'vods');
const vodDirPattern = path.join(vodDir, `*.md`);


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

	// create VOD object for each VOD *.mp4 file in the workdir (created by voddo)
	const videoFiles = await fg([ workDirPattern ]);
	for (const videoFile of videoFiles) {
		const v = new VOD({ videoSrcTmp: videoFile });
		vods.push(v);
	}

	console.log(vods);
	console.log(vods.length);

})()