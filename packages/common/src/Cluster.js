

import dotenv from 'dotenv'
import got from 'got'
import https from 'https'
import path from 'node:path'
import { FormData } from 'formdata-node'
import fs, { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import { fileFromPath } from "formdata-node/file-from-path"
import { loggerFactory } from 'common/logger'

dotenv.config()

// const ipfsClusterExecutable = '/usr/local/bin/ipfs-cluster-ctl'
// const ipfsClusterUri = 'https://cluster.sbtp.xyz:9094'

// const IPFS_CLUSTER_HTTP_API_USERNAME = process.env.IPFS_CLUSTER_HTTP_API_USERNAME;
// const IPFS_CLUSTER_HTTP_API_PASSWORD = process.env.IPFS_CLUSTER_HTTP_API_PASSWORD;
// const IPFS_CLUSTER_HTTP_API_MULTIADDR = process.env.IPFS_CLUSTER_HTTP_API_MULTIADDR;


// if (typeof IPFS_CLUSTER_HTTP_API_USERNAME === 'undefined') throw new Error('IPFS_CLUSTER_HTTP_API_USERNAME in env is undefined');
// if (typeof IPFS_CLUSTER_HTTP_API_PASSWORD === 'undefined') throw new Error('IPFS_CLUSTER_HTTP_API_PASSWORD in env is undefined');
// if (typeof IPFS_CLUSTER_HTTP_API_MULTIADDR === 'undefined') throw new Error('IPFS_CLUSTER_HTTP_API_MULTIADDR in env is undefined');


const logger = loggerFactory({
  defaultMeta: {
    service: 'futureporn/common'
  }
})





const getArgs = function () {
  let args = [
    '--no-check-certificate',
    '--host', IPFS_CLUSTER_HTTP_API_MULTIADDR,
    '--basic-auth', `${IPFS_CLUSTER_HTTP_API_USERNAME}:${IPFS_CLUSTER_HTTP_API_PASSWORD}`
  ]
  return args
}


const getHttpsAgent = () => {
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false
  });
  return httpsAgent
}


const fixInvalidJson = (invalidJson) => {
  return invalidJson
    .split('\n')
    .filter((i) => i !== '')
    .map((datum) => JSON.parse(datum))
}


/**
 * query the cluster for a list of all the pins
 * 
 * @resolves {String}
 */
const ipfsClusterPinsQuery = async () => {
  const httpsAgent = getHttpsAgent()
  const res = await fetch(`${ipfsClusterUri}/pins?stream-channels=false`, {
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


const ipfsClusterStatus = async (pin) => {
  const httpsAgent = getHttpsAgent()
  const res = await fetch(`${ipfsClusterUri}/pins/${pin}`, {
    headers: {
      'Authorization': `Basic ${Buffer.from(IPFS_CLUSTER_HTTP_API_USERNAME+':'+IPFS_CLUSTER_HTTP_API_PASSWORD, "utf-8").toString("base64")}`
    },
    agent: httpsAgent
  })
  const b = await res.text()
  return fixInvalidJson(b)
}


const ipfsClusterStatusAll = async (pin) => {
  const httpsAgent = getHttpsAgent()
  const res = await fetch(`${ipfsClusterUri}/pins`, {
    headers: {
      'Authorization': `Basic ${Buffer.from(IPFS_CLUSTER_HTTP_API_USERNAME+':'+IPFS_CLUSTER_HTTP_API_PASSWORD, "utf-8").toString("base64")}`
    },
    agent: httpsAgent
  })
  const b = await res.text()
  return fixInvalidJson(b)
}



export default class Cluster {
  constructor(opts) {
    this.username = opts.username
    this.password = opts.password
    this.uri = opts.uri || 'https://sbtp.xyz:9094'
    if (typeof this.username === 'undefined') throw new Error('username not defined');
    if (typeof this.password === 'undefined') throw new Error('password not defined');
  }
  async add (filename, fileSize) {
    const streamPipeline = promisify(pipeline);

    const agent = new https.Agent({
      rejectUnauthorized: false
    });

    const form = new FormData()
    form.set('file', await fileFromPath(filename))

    const opts = {
      https: { rejectUnauthorized: false },
      body: form,
      headers: {
        'Accept': '*/*',
        'Authorization': `Basic ${Buffer.from(this.username+':'+this.password).toString('base64')}`
      },
      isStream: true
    }



    for (let i = 0; i < 5; i++) {
      let bytesReport = 0
      let timer
      let output
      try {

        timer = setInterval(() => {
          if (typeof fileSize !== 'undefined') {
            logger.log({ level: 'info', message: `adding to IPFS. Progress: ${(bytesReport/fileSize*100).toFixed(2)}%`})
          } else {
            logger.log({ level: 'info', message: `adding to IPFS. Bytes transferred: ${bytesReport}` })
          }
        }, 60000)

        logger.log({ level: 'info', message: `Adding ${filename} to IPFS cluster. Attempt ${i+1}` });
        const res = await got.post(`${this.uri}/add?cid-version=1&progress=1`, opts);

        // progress updates are streamed from the cluster
        // for each update, just display it
        // when a cid exists in the output, it's done.
        for await (const chunk of res) {
          const data = JSON.parse(chunk.toString());
          bytesReport = data?.bytes

          logger.log({ level: 'trace', message: JSON.stringify(data) });
          if (data?.cid) {
            clearInterval(timer)
            return data.cid;
          }
        }
      } catch (e) {
        logger.log({ level: 'error', message: `error while uploading! ${e}` });
        if (i < 4) {
          logger.log({ level: 'info', message: `Retrying the upload...` });
        }
        clearInterval(timer)
      }
    }

  }
}