import 'dotenv/config'
import postgres from 'postgres'
import { loggerFactory } from 'common/logger'
import { workerId } from 'common/id'
import { ipfsHashRegex } from 'common/constants'
import Cluster from 'common/Cluster'
import path from 'node:path'
import {execa} from 'execa'
import {got} from 'got'
import {rename, writeFile, readFile} from 'node:fs/promises'
import fs from 'node:fs'
import { pipeline } from 'node:stream/promises'
import stream from 'node:stream'
import tar from 'tar'



if (typeof process.env.POSTGRES_HOST === 'undefined') throw new Error('POSTGRES_HOST undef');
if (typeof process.env.POSTGRES_USERNAME === 'undefined') throw new Error('POSTGRES_USERNAME undef');
if (typeof process.env.POSTGRES_PASSWORD === 'undefined') throw new Error('POSTGRES_PASSWORD undef');
if (typeof process.env.FUTUREPORN_WORKDIR === 'undefined') throw new Error('FUTUREPORN_WORKDIR is undefined in env');

const reportInterval = 60000
const delayBetweenAttempts = 30000


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
    SELECT "videoSrcHash", "video240Hash", "thiccHash", "id"
    FROM vod
    WHERE "video240Hash" IS NULL
    ORDER BY RANDOM()
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

async function stat (cid) {
  return got(
    'http://127.0.0.1:5001/api/v0/block/stat',
    {
      method: 'POST',
      body: '',
      responseType: 'json',
      searchParams: {
        arg: cid
      },
      timeout: {
        request: 1000*60
      }
    }
  ).json()
}


async function download (cid, size) {
  if (typeof cid === 'undefined') throw new Error('cid is undefined');
  const gotStream = got.stream(
    'http://127.0.0.1:5001/api/v0/get',
    {
      method: 'POST',
      body: '',
      searchParams: {
        arg: cid,
        // Even if I switch archive to false, we get the same tar response.
        // apparently there is no way via the API to get anything other than a tar stream
        // see: https://discuss.ipfs.tech/t/download-more-bytes-when-using-curl-command/562
        // see: https://github.com/ipfs/kubo/issues/6477
        // 
        // so we are just putting archive: true, compress: false to future-proof.
        // in case a default is ever set, we will be on the setting that we are coded to handle
        archive: true, 
        compress: false
      },
      timeout: {
        request: 1000*60*60*3 // 3 hour timeout
      }
    }
  )

  let progressReportTimer 

  try {
    cid = ipfsHashRegex.exec(cid)[0]
    const localFilePath = path.join(process.env.FUTUREPORN_WORKDIR, `${cid}.mp4`)
    logger.log({ level: 'debug', message: `downloading ${cid} from IPFS to ${localFilePath}` })


    progressReportTimer = setInterval(() => {
      if (typeof size !== 'undefined') {
        // accurate percentage if we know the filesize
        const progressPercentage = ((gotStream.downloadProgress.transferred / size) * 100).toFixed(2)
        logger.log({ level: 'info', message: `transferred:${gotStream.downloadProgress.transferred}, size:${size}, ${progressPercentage}% transferred.` })
      } else {
        // generic progress
        logger.log({ level: 'info', message: JSON.stringify(gotStream.downloadProgress) })
      }
    }, reportInterval)


    const extractStream = tar.extract({
      C: process.env.FUTUREPORN_WORKDIR,
    })

    gotStream.pipe(extractStream)


    await new Promise((resolve, reject) => {
      extractStream.once('error', reject);
      extractStream.once('finish', resolve);
    })



    logger.log({ level: 'info', message: 'renaming the CID file to CID.mp4'})
    await rename(
      path.join(process.env.FUTUREPORN_WORKDIR, cid),
      localFilePath
    )

    // await writeFile(localFilePath, await res.buffer())
    logger.log({ level: 'info', message: `Downloaded ${cid} to ${localFilePath}` })
    



    return localFilePath;
  } catch (e) {
    logger.log({ level: 'error', message: 'error while downloading' })
    logger.log({ level: 'error', message: e })
    console.trace()
  } finally {
    clearInterval(progressReportTimer)
  }
}

// greets ChatGPT
async function getLastFrameNumber(filePath) {
  const fileContent = await readFile(filePath, 'utf-8');
  const matches = fileContent.match(/frame=(\d+)/g);
  if (matches && matches.length > 0) {
    const lastMatch = matches[matches.length - 1];
    const numberMatch = lastMatch.match(/\d+/g);
    if (numberMatch && numberMatch.length > 0) {
      return parseInt(numberMatch[numberMatch.length - 1]);
    }
  }
  return null;
}

async function getTotalFrameCount (filename) {
  const { exitCode, killed, stdout, stderr } = await execa('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=nb_frames',
    '-of', 'default=nokey=1:noprint_wrappers=1',
    filename
  ])
  if (exitCode !== 0 || killed !== false) {
    throw new Error(`problem while getting frame count. exitCode:${exitCode}, killed:${killed}, stdout:${stdout}, stderr:${stderr}`);
  }
  return parseInt(stdout)
}

/**
 * @param {string} input
 * @resolves {string} output
 */
async function transcode (filename) {
  if (typeof filename === 'undefined') throw new Error('filename is undefined');
  const progressFilePath = path.join(process.env.FUTUREPORN_WORKDIR, 'ffmpeg-progress.log')
  const outputFilePath = path.join(process.env.FUTUREPORN_WORKDIR, path.basename(filename, '.mp4')+'_240p.mp4')
  const totalFrames = await getTotalFrameCount(filename)

  logger.log({ level: 'debug', message: `transcoding ${filename} to ${outputFilePath} and saving progress log to ${progressFilePath}` })
  let progressReportTimer = setInterval(async () => {
    try {
      const frame = await getLastFrameNumber(progressFilePath)
      logger.log({ level: 'info', message: `transcoder progress-- ${(frame/totalFrames*100).toFixed(2)}%` })
    } catch (e) {
      logger.log({ level: 'info', message: 'we got an error thingy while reading the ffmpeg-progress log but its ok we can just ignore and try again later.' })
    }
  }, reportInterval)
  const { exitCode, killed, stdout, stderr } = await execa('ffmpeg', [
    '-y',
    '-i', filename,
    '-vf', 'scale=w=-2:h=240',
    '-b:v', '386k',
    '-b:a', '45k',
    '-progress', progressFilePath,
    outputFilePath
  ]);
  if (exitCode !== 0 || killed !== false) {
    throw new RemuxError(`exitCode:${exitCode}, killed:${killed}, stdout:${stdout}, stderr:${stderr}`);
  }
  logger.log({ level: 'info', message: 'transcode COMPLETE!' })
  clearInterval(progressReportTimer)
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



// async function transcode240pVideo () {
//   if (this.video240Hash !== '') return;
//   await this.ensureTmpFilePath();
//   const videoBasename = this._getVideoBasename('240p');
//   const target = VOD._getTmpDownloadPath(videoBasename);
//   const { exitCode, killed, stdout, stderr } = await execa('ffmpeg', ['-y', '-i', this.tmpFilePath, '-vf', 'scale=w=-2:h=240', '-b:v', '386k', '-b:a', '45k', target]);
//   if (exitCode !== 0 || killed !== false) {
//     throw new RemuxError(`exitCode:${exitCode}, killed:${killed}, stdout:${stdout}, stderr:${stderr}`);
//   } else {
//     this.video240HashTmp = target;
//   }
//   const hash = await this._ipfsUpload(this.video240HashTmp);
//   if (typeof hash === 'undefined') throw new UploadFailedError()
//   this.video240Hash = `${hash}?filename=${videoBasename}`
// }

async function sleep (ms) {
  logger.log({ level: 'debug', message: `sleeping for ${ms}ms` })
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function save (id, video240Hash, thiccHash) {
  for (let i = 0; i < 5; i++) {
    logger.log({ level: 'info', message: `Saving id:${id}, video240Hash:${video240Hash}, thiccHash:${thiccHash} to db. Attempt ${i+1}` });
    try {
      await sql`UPDATE vod SET "video240Hash" = ${video240Hash} WHERE vod.id = ${id};`
    } catch (e) {
      logger.log({ level: 'error', message: `error while saving! ${e}` });
      if (i < 4) {
        logger.log({ level: 'info', message: `Retrying the save...` });
      }
    }
  }
}

async function main () {
  const cluster = new Cluster({
    username: process.env.IPFS_CLUSTER_HTTP_API_USERNAME,
    password: process.env.IPFS_CLUSTER_HTTP_API_PASSWORD
  })

  // const devCid = 'bafybeihd4slqjqmtcwvcccdco32ko6nrvn2pqkmgnrnxddeze2tlpiaqo4'
  // const size = await stat(devCid)
  // console.log(size)
  // const data = await cluster.add('/home/chris/Documents/projektmelody/Projekt Melody _ VSHOJO - A.I.s save so much money on closet space-1596526711801319427.mp4')
  // console.log(data)
  // process.exit()

  while (true) {
    try {
      logger.log({ level: 'debug', message: 'looking for an unprocessed VOD.' })
      const vod = await find()
      if (vod === null) {
        logger.log({ level: 'info', message: 'there are no unprocessed videos. idling.' })
      } else {
        logger.log({ level: 'debug', message: `the VOD id we are working with is ${vod.id}` })

        // stat
        logger.log({ level: 'debug', message: `getting stats of ${vod.videoSrcHash}`})
        const statRes = await stat(vod.videoSrcHash)
        const size = statRes.Size
        logger.log({ level: 'debug', message: `size is ${size} (${JSON.stringify(statsRes)})` })

        // download
        logger.log({ level: 'debug', message: `downloading ${vod.videoSrcHash}`})
        const filenameSrc = await download(vod.videoSrcHash, size)
        logger.log({ level: 'debug', message: `downloaded:${filenameSrc}`})

        if (typeof filenameSrc === 'undefined') throw new Error('download did not return a localFilePath')

        // transcode
        logger.log({ level: 'debug', message: `transcoding ${filenameSrc}`})
        const filename240 = await transcode(filenameSrc)

        // upload
        logger.log({ level: 'debug', message: `uploading ${filename240}`})
        const data = await cluster.add(filename240)

        // save
        logger.log({ level: 'debug', message: `saving ${data.cid} to the db`})
        await save(vod.id, data.cid)
      }

      logger.log({ level: 'debug', message: `waiting ${delayTime}ms until next run.` })
    } catch (e) {

      logger.log({ level: 'error', message: `problem while running main process-- ${e}` })
    }
    await sleep(delayBetweenAttempts)
  }


}


main()
