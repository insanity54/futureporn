#!/usr/bin/env node


const path = require('path');
const globby = require('globby');
const matter = require('gray-matter');
const fsp = require('fs').promises;
const execa = require('execa');
const { format } = require('date-fns');
const minimist = require('minimist');
const { __, curry, not, or, isEmpty, isNil, append, filter, flatten, props, pluck, compose, transduce } = require('ramda');



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






(async function main () {

	const args = minimist(process.argv.slice(2))
	if (!args.mode) {
		console.error('--mode is required. One of (cidlist|all)')
		return
	}


	const md = await getVodsAsJson();
	const vods = pluck('data', md)
	console.log(vods)
	if (args.mode === 'cidlist') {

		const getProps = props ([
			'videoSrcHash',
			'video720Hash',
			'video480Hash',
			'video360Hash',
			'video240Hash',
			'thinHash',
			'thiccHash'
		])


		const cidlist = vods
			.flatMap(getProps)
			.filter((i) => not(isNil(i)))
			.filter((i) => not(isEmpty(i)))
			.map((h) => {
				const index = h.indexOf('?');
				if (index > -1) return h.substring(0, h.indexOf('?'))
				else return h
			})


		console.log(JSON.stringify(cidlist));
	} else if (args.mode === 'all') {
		console.log(JSON.stringify(vods));
	}
})()


module.exports = {
	getVodsAsJson
}