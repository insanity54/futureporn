#!/usr/bin/env node


const path = require('path');
const globby = require('globby');
const matter = require('gray-matter');
const fsp = require('fs').promises;
const execa = require('execa');
const { format } = require('date-fns');



/** ansible uses this function to generate a list of IPFS hashes that the gateway will serve **/
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




(async () => {
	const vods = await getVodsAsJson()
	console.log(JSON.stringify(vods, 0, 2));
})()