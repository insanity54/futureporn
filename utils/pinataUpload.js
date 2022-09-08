#!/usr/bin/env node

const dotenv = require('dotenv');
const minimist = require('minimist');
const pinataSDK = require('@pinata/sdk');
const fs = require('node:fs');

const _ipfsPinataUpload = async (filename) => {
	const pinataApiKey = process.env.PINATA_API_KEY;
	const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;

	if (typeof pinataApiKey === 'undefined') throw new Error('PINATA_API_KEY was missing from env');
	if (typeof pinataSecretApiKey === 'undefined') throw new Error('PINATA_SECRET_API_KEY was missing from env');

	const pinata = pinataSDK(pinataApiKey, pinataSecretApiKey);
	const result = await pinata.testAuthentication();
	console.log(`  [*] successfully authed with Pinata`)
	console.log(result);

	try {
		const stream = fs.createReadStream(filename);
		const response = await pinata.pinFileToIPFS(stream);
		const { IpfsHash } = response;
		return IpfsHash;
	} catch (e) {
		console.log(e)
		console.log('there was an eerror')
	}
}

(async () => {

	const args = minimist(process.argv.slice(2))
	await _ipfsPinataUpload(args._[0]);

})()
