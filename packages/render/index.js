import 'dotenv/config'
import postgres from 'postgres'
import { loggerFactory } from 'common/logger'
import { workerId } from 'common/id'
import { ipfsHashRegex } from 'common/constants'
import Cluster from 'common/Cluster'
import path from 'node:path'
import {execa} from 'execa'

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

async function download (cid) {
  cid = ipfsHashRegex.exec(cid)[0]
  const localFilePath = path.join(process.env.FUTUREPORN_WORKDIR, `${cid}.mp4`)
  logger.log({ level: 'debug', message: `  [*] downloading ${cid} from IPFS to ${localFilePath}` })
  const proc = execa('ipfs', ['-c', '/home/ipfs/.ipfs', 'get', '-o', localFilePath, cid]);
  const {stdout, stderr} = await proc;
  logger.log({ level: 'debug', message: `  [*] download to ${localFilePath} is done` });
  logger.log({ level: 'debug', message: stdout })
  logger.log({ level: 'debug', message: stderr })
  return localFilePath;
}


/**
 * @param {string} input
 * @resolves {string} output
 */
async function transcode (filename) {
  const outputFilePath = path.join(FUTUREPORN_WORKDIR, path.basename(filename, '.mp4')+'_240p.mp4')
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
    logger.log({ level: 'debug', message: `transcoding ${filename}`})
    const filename240 = await transcode(filename)

    // upload
    logger.log({ level: 'debug', message: `uploading ${filename240}`})
    const data = await cluster.add(filename240)

    // save
    logger.log({ level: 'debug', message: `saving ${data.cid}`})
    await sql`UPDATE vod SET "video240Hash" = ${data.cid} WHERE vod.id = ${vod.id};`
  }



  logger.log({ level: 'debug', message: `waiting ${delayTime}ms until next run.` })
  // await sleep(delayTime)
  // }
}


main()