#!/usr/bin/env node

require('dotenv').config();
const fsp = require('fs/promises');
const path = require('node:path');
const execa = require('execa');


const IPFS_CLUSTER_HTTP_API_USERNAME = process.env.IPFS_CLUSTER_HTTP_API_USERNAME;
const IPFS_CLUSTER_HTTP_API_PASSWORD = process.env.IPFS_CLUSTER_HTTP_API_PASSWORD;
const IPFS_CLUSTER_HTTP_API_MULTIADDR = process.env.IPFS_CLUSTER_HTTP_API_MULTIADDR;

if (typeof IPFS_CLUSTER_HTTP_API_USERNAME === 'undefined') throw new Error('IPFS_CLUSTER_HTTP_API_USERNAME in env is undefined');
if (typeof IPFS_CLUSTER_HTTP_API_PASSWORD === 'undefined') throw new Error('IPFS_CLUSTER_HTTP_API_PASSWORD in env is undefined');
if (typeof IPFS_CLUSTER_HTTP_API_MULTIADDR === 'undefined') throw new Error('IPFS_CLUSTER_HTTP_API_MULTIADDR in env is undefined');

const ipfsClusterUpload = async (filename) => {
	try {
		const { stdout } = await execa('/usr/local/bin/ipfs-cluster-ctl', [
			'--no-check-certificate',
			'--host', IPFS_CLUSTER_HTTP_API_MULTIADDR,
			'--basic-auth', `${IPFS_CLUSTER_HTTP_API_USERNAME}:${IPFS_CLUSTER_HTTP_API_PASSWORD}`,
			'add', '--quieter', filename
		]);
		return stdout;
	} catch (e) {
		console.error('Error while adding file to ipfs');
		console.error(e);
	}
}


module.exports = ipfsClusterUpload;