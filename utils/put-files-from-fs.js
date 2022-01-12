#!/usr/bin/env node

const dotenv = require('dotenv');
const minimist = require('minimist');
const { Web3Storage, getFilesFromPath } = require('web3.storage');
const debug = require('debug')('futureporn');
dotenv.config();

async function upload (storage, files, attempt = 0) {
  try {
    attempt++;

    debug('uploading');
    const rootCid = await storage.put(files)

    debug(`the rootCid is ${rootCid}`);

    const res = await storage.get(rootCid); // Promise<Web3Response | null>
    const ipfsFiles = await res.files(); // Promise<Web3File[]>

    const cid = ipfsFiles[0].cid;
    debug(`the file cid is ${cid}`)

    return cid;

  } catch (e) {
    console.error(e);
    debug(`upload error at attempt ${attempt}. trying again.`);

    if (attempt > 2) throw new Error(`Upload failed. Tried ${attempt} times.`);
    else return upload(storage, files, attempt);
  }
}


async function main () {
  const args = minimist(process.argv.slice(2))
  
  const token = process.env.WEB3_TOKEN;
  if (typeof token === 'undefined') {
    return console.error('A token is needed. (WEB3_TOKEN in env must be defined). You can create one on https://web3.storage. ')
  }

  const fileList = args._;
  debug('creating storage instance')
  const storage = new Web3Storage({ token })

  debug('getting files from path')
  const files = await getFilesFromPath(fileList)
  debug(files)

  const cid = await upload(storage, files);

  const result = {
    cid
  }

  console.log(JSON.stringify(result));
}

main()

module.exports = {
  upload
}