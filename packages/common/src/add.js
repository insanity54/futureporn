import dotenv from 'dotenv'
import got from 'got'
import https from 'https'
import path from 'node:path'
import { FormData } from 'formdata-node'
import fs, { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import { fileFromPath } from "formdata-node/file-from-path"

dotenv.config()

if (typeof process.env.IPFS_CLUSTER_HTTP_API_USERNAME === 'undefined') throw new Error('process.env.IPFS_CLUSTER_HTTP_API_USERNAME undef');
if (typeof process.env.IPFS_CLUSTER_HTTP_API_PASSWORD === 'undefined') throw new Error('process.env.IPFS_CLUSTER_HTTP_API_PASSWORD undef');



async function main () {
  let cid;
  const streamPipeline = promisify(pipeline);

  const agent = new https.Agent({
    rejectUnauthorized: false
  });

  const form = new FormData()
  form.set('file', await fileFromPath('/home/chris/Documents/projektmelody/Projekt Melody _ VSHOJO - A.I.s save so much money on closet space-1596526711801319427.mp4'))

  const opts = {
    https: { rejectUnauthorized: false },
    body: form,
    headers: {
      'Accept': '*/*',
      'Authorization': `Basic ${Buffer.from(process.env.IPFS_CLUSTER_HTTP_API_USERNAME+':'+process.env.IPFS_CLUSTER_HTTP_API_PASSWORD).toString('base64')}`
    },
  }
  const res = await got.stream.post('https://sbtp.xyz:9094/add?cid-version=1&progress=1', opts)

  res.on('data', (data) => {
    if (typeof data?.cid !== 'undefined') {
      resolve(data.cid)
    }
  })

  res.on('error', (error) => {
    reject(error)
  })
}


main().then((cid) => {
  console.log(`CID:${cid}`)
}).catch((error) => {
  console.error(error)
})