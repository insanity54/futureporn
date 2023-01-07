#!/usr/bin/env node

require('dotenv').config();
const fsp = require('fs/promises');
const path = require('node:path');
const execa = require('execa');
const fetch = require('node-fetch')
const https = require('https');

const ipfsClusterExecutable = '/usr/local/bin/ipfs-cluster-ctl'

const IPFS_CLUSTER_HTTP_API_USERNAME = process.env.IPFS_CLUSTER_HTTP_API_USERNAME;
const IPFS_CLUSTER_HTTP_API_PASSWORD = process.env.IPFS_CLUSTER_HTTP_API_PASSWORD;
const IPFS_CLUSTER_HTTP_API_MULTIADDR = process.env.IPFS_CLUSTER_HTTP_API_MULTIADDR;

if (typeof IPFS_CLUSTER_HTTP_API_USERNAME === 'undefined') throw new Error('IPFS_CLUSTER_HTTP_API_USERNAME in env is undefined');
if (typeof IPFS_CLUSTER_HTTP_API_PASSWORD === 'undefined') throw new Error('IPFS_CLUSTER_HTTP_API_PASSWORD in env is undefined');
if (typeof IPFS_CLUSTER_HTTP_API_MULTIADDR === 'undefined') throw new Error('IPFS_CLUSTER_HTTP_API_MULTIADDR in env is undefined');




const getArgs = function () {
	let args = [
		'--no-check-certificate',
		'--host', IPFS_CLUSTER_HTTP_API_MULTIADDR,
		'--basic-auth', `${IPFS_CLUSTER_HTTP_API_USERNAME}:${IPFS_CLUSTER_HTTP_API_PASSWORD}`
	]
	return args
}


/**
 * query the cluster for a list of all the pins
 * 
 * @resolves {String}
 */
const ipfsClusterPinsQuery = async () => {
	const httpsAgent = new https.Agent({
		rejectUnauthorized: false
	});
	const res = await fetch(`https://cluster.sbtp.xyz:9094/pins?stream-channels=false`, {
		headers: {
			'Authorization': `Basic ${Buffer.from(IPFS_CLUSTER_HTTP_API_USERNAME+':'+IPFS_CLUSTER_HTTP_API_PASSWORD, "utf-8").toString("base64")}`
		},
		agent: httpsAgent
	})
	const b = await res.text()
	const c = b.split('\n')
	const d = c.filter((i) => i !== '')
	const e = d.map((datum) => JSON.parse(datum))
	return e
}


const ipfsClusterUpload = async (filename, expiryDuration) => {
	try {
		let args = getArgs()

		args = args.concat([
			'add', 
			'--quieter', 
			'--cid-version', 1
		])

		if (expiryDuration) {
			args = args.concat(['--expire-in', expiryDuration])
		}

		args.push(filename)

		const { stdout } = await execa(ipfsClusterExecutable, args)
		return stdout
	} catch (e) {
		console.error('Error while adding file to ipfs')
		console.error(e)
	}
}


module.exports = {
	ipfsClusterUpload,
	ipfsClusterPinsQuery
}