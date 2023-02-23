import 'dotenv/config'
import postgres from 'postgres'
import { loggerFactory } from 'common/logger'
import { workerId } from 'common/id'
import { ipfsHashRegex } from 'common/constants'
import Cluster from 'common/Cluster'
import path from 'node:path'
import {execa} from 'execa'
import {got} from 'got'
import fs from 'node:fs'

if (typeof process.env.POSTGRES_HOST === 'undefined') throw new Error('POSTGRES_HOST undef');
if (typeof process.env.POSTGRES_USERNAME === 'undefined') throw new Error('POSTGRES_USERNAME undef');
if (typeof process.env.POSTGRES_PASSWORD === 'undefined') throw new Error('POSTGRES_PASSWORD undef');
if (typeof process.env.FUTUREPORN_WORKDIR === 'undefined') throw new Error('FUTUREPORN_WORKDIR is undefined in env');

const logger = loggerFactory({
  defaultMeta: {
    service: 'futureporn/render'
  }
})


const sql = postgres({
  host: process.env.POSTGRES_HOST,
  password: process.env.POSTGRES_PASSWORD,
  user: process.env.POSTGRES_USERNAME,
  database: 'futureporn',
  idle_timeout: 1
})


async function find () {
  const results = await sql`
    SELECT "videoSrcHash", "video240Hash", "thiccHash"
    FROM vod
    WHERE "video240Hash" IS NULL
    ORDER BY date DESC
    LIMIT 1;
  `
  return (!!results[0]) ? results[0] : null
}



function _getIpfsHash (input) {
  const result = ipfsHashRegex.exec(input);
  return result[0]
}

// ubuuntu iso QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB
// getting started txt /ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme

async function download (cid) {
  cid = ipfsHashRegex.exec(cid)[0]
  const localFilePath = path.join(process.env.FUTUREPORN_WORKDIR, `${cid}.mp4`)
  logger.log({ level: 'debug', message: `  [*] downloading ${cid} from IPFS to ${localFilePath}` })


  // const ssCid = '/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme'
  const res = got.post(
    'http://127.0.0.1:5001/api/v0/get',
    {
      searchParams: {
        arg: cid
      },
      timeout: {
        request: 1000*60*60*3
      }
    }
  )

  res.on('response', (res) => {
    console.log('got response')
    console.log(res.headers)
    console.log(response.trailers)
  })

  res.on('downloadProgress', (progress) => {
    if (progress.transferred % (10 * 1024 * 1024) === 0) {
      logger.log({ level: 'info', message: `progress bytes:${progress.transferred}, percentage:${progress.percent}` })
    }
  })


  const downloadBuffer = res.buffer()
  fs.writeFile(localFilePath, downloadBuffer, (err) => {
    if (err) {
      console.error(err)
    } else {
      console.log(`Downloaded ${cid} to ${localFilePath}`)
    }
  })


  return localFilePath;
}


/**
 * @param {string} input
 * @resolves {string} output
 */
async function transcode (filename) {
  const outputFilePath = path.join(process.env.FUTUREPORN_WORKDIR, path.basename(filename, '.mp4')+'_240p.mp4')
  const { exitCode, killed, stdout, stderr } = await execa('ffmpeg', ['-y', '-i', filename, '-vf', 'scale=w=-2:h=240', '-b:v', '386k', '-b:a', '45k', outputFilePath]);
  if (exitCode !== 0 || killed !== false) {
    throw new RemuxError(`exitCode:${exitCode}, killed:${killed}, stdout:${stdout}, stderr:${stderr}`);
  }
  return outputFilePath
}



/**
 * @param {string} input
 * @resolves {string} output
 */
async function thumbnail (filename) {

}


async function notify () {

}



async function transcode240pVideo () {
  if (this.video240Hash !== '') return;
  await this.ensureTmpFilePath();
  const videoBasename = this._getVideoBasename('240p');
  const target = VOD._getTmpDownloadPath(videoBasename);
  console.log(`transcoding ${this.tmpFilePath} to ${target}`);
  const { exitCode, killed, stdout, stderr } = await execa('ffmpeg', ['-y', '-i', this.tmpFilePath, '-vf', 'scale=w=-2:h=240', '-b:v', '386k', '-b:a', '45k', target]);
  if (exitCode !== 0 || killed !== false) {
    throw new RemuxError(`exitCode:${exitCode}, killed:${killed}, stdout:${stdout}, stderr:${stderr}`);
  } else {
    this.video240HashTmp = target;
  }
  const hash = await this._ipfsUpload(this.video240HashTmp);
  if (typeof hash === 'undefined') throw new UploadFailedError()
  this.video240Hash = `${hash}?filename=${videoBasename}`
}

async function sleep (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}


async function main () {
  const cluster = new Cluster({
    username: process.env.IPFS_CLUSTER_HTTP_API_USERNAME,
    password: process.env.IPFS_CLUSTER_HTTP_API_PASSWORD
  })

  const delayTime = 1000*60
  // while (true) {
  try {
    logger.log({ level: 'debug', message: 'looking for an unprocessed VOD.' })
    const vod = await find()
    if (vod === null) {
      logger.log({ level: 'info', message: 'there are no unprocessed videos. idling.' })
    } else {
      logger.log({ level: 'debug', message: vod })

      // download
      logger.log({ level: 'debug', message: `downloading ${vod.videoSrcHash}`})
      const filenameSrc = await download(vod.videoSrcHash)

      // transcode
      logger.log({ level: 'debug', message: `transcoding ${filenameSrc}`})
      const filename240 = await transcode(filenameSrc)

      // upload
      logger.log({ level: 'debug', message: `uploading ${filename240}`})
      const data = await cluster.add(filename240)

      // save
      logger.log({ level: 'debug', message: `saving ${data.cid}`})
      await sql`UPDATE vod SET "video240Hash" = ${data.cid} WHERE vod.id = ${vod.id};`
    }

    logger.log({ level: 'debug', message: `waiting ${delayTime}ms until next run.` })
  } catch (e) {
    logger.log({ level: 'error', message: `problem while running main process-- ${e}` })
  }
    // await sleep(delayTime)
    // }
}


main()