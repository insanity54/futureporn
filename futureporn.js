


import VOD from './VOD';
import fg from 'fast-glob';
import path from 'path';

const workDir = __dirname;
const workDirPattern = path.join(workDir, '*.mp4');
const vodDir = path.join(__dirname, 'website', 'vods');
const vodDirPattern = path.join(vodDir, `*.md`);


(async function main() {
	let vods = [];


	// create VOD object for each VOD markdown file
	const markdownFiles = await fg([ vodDirPattern ]);
	for (markdownFile in markdownFiles) {
		const mdRaw = await fsp.readFile(markdownFile);
		const { data } = await marked(mdRaw);
		const v = new VOD(data);
		console.log(`VOD found with date:${v.date}`);
		vods.push(v);
	}

	// create VOD object for each VOD *.mp4 file in the workdir (created by voddo)
	const videoFiles = await fg([ workDirPattern ]);
	for (videoFile in videoFiles) {
		const v = new VOD({ videoSrcTmp: videoFile });
		vods.push(v);
	}

	console.log(vods);
	console.log(vods.length);

})()