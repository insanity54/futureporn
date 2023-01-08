
const execa = require('execa')
const cidV0Regex = require('./constants.js')



async function convertToV1 (val) {
	if (typeof val === 'undefined') throw new Error('convertToV1 received an undefined argument');
	let cid;
	let v1Cid;
	let p;
	if (val.includes('?')) {
		p = val.split('?')
		cid = p[0]
	} else {
		cid = val
	}

	const { exitCode, killed, stdout, stderr } = await execa('ipfs', ['cid', 'base32', cid]);
	if (exitCode !== 0 || killed !== false) {
		throw new Error(`exitCode:${exitCode}, killed:${killed}, stdout:${stdout}, stderr:${stderr}`);
	} else {
		if (typeof p !== 'undefined' && p.length > 0) {
			v1Cid = `${stdout}?${p[1]}`
		} else {
			v1Cid = stdout
		}
	}
	return v1Cid
}

function isCidV0 (txt) {
	return cidV0Regex.test(txt)
}


module.exports = {
	convertToV1,
	isCidV0
}