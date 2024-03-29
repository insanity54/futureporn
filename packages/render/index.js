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
import os from 'node:os'
import stream from 'node:stream'
import { pipeline } from 'node:stream/promises'
import tar from 'tar'
import Prevvy from 'prevvy'



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


/**
 * greets ChatGPT
 */
async function download(cid, fileSize) {
  if (!cid) throw new Error('cid is undefined');

  logger.log({ level: 'debug', message: `downloading cid:${cid}`})

  const MAX_RETRY_ATTEMPTS = 5;
  const REQUEST_TIMEOUT_MS = 1000 * 60 * 60 * 3; // 3 hours
  const PROGRESS_REPORT_INTERVAL_MS = 1000 * 60; // 1 minute

  const ipfsHashRegex = /[^a-zA-Z0-9_-]/g;
  const localFilePath = path.join(process.env.FUTUREPORN_WORKDIR, `${cid}.mp4.tar`);
  const options = {
    method: 'POST',
    body: '',
    searchParams: {
      arg: cid,
      archive: true,
      compress: false
    },
    timeout: {
      request: REQUEST_TIMEOUT_MS
    }
  };

  let progressReportTimer = null;
  let lastTransferredSize = 0;
  let stalledTimeMs = 0;
  let isDownloadStalled = false;

  for (let retryCount = 0; retryCount < MAX_RETRY_ATTEMPTS; retryCount++) {
    try {
      logger.log({ level: 'debug', message: 'Downloading...' });
      const gotStream = got.stream('http://127.0.0.1:5001/api/v0/get', options);

      progressReportTimer = setInterval(() => {
        const transferredSize = gotStream.downloadProgress.transferred;
        const progressPercentage = fileSize ? ((transferredSize / fileSize) * 100).toFixed(2) : null;

        logger.log({
          level: 'info',
          message: fileSize
            ? `transferred: ${transferredSize}, size: ${fileSize}, ${progressPercentage}% transferred.`
            : JSON.stringify(gotStream.downloadProgress)
        });

        // Check if the download has stalled
        if (transferredSize === lastTransferredSize) {
          stalledTimeMs += PROGRESS_REPORT_INTERVAL_MS;
          if (stalledTimeMs >= 5 * 60 * 1000) { // 5 minutes
            isDownloadStalled = true;
            throw new Error('Download stalled for more than 5 minutes.');
          }
        } else {
          stalledTimeMs = 0;
        }

        lastTransferredSize = transferredSize;
      }, PROGRESS_REPORT_INTERVAL_MS);

      await pipeline(gotStream, fs.createWriteStream(localFilePath));
      logger.log({ level: 'info', message: `Downloaded ${cid} to ${localFilePath}` });
      return localFilePath;
    } catch (error) {
      logger.log({ level: 'error', message: 'Error while downloading!' });
      logger.log({ level: 'error', message: error });
    } finally {
      clearInterval(progressReportTimer);

      if (isDownloadStalled) {
        throw new Error('Download stalled for more than 5 minutes.');
      }
    }
  }
}


async function extract (tarFile, cid) {

  // The only file in the tar is going to be the video.
  // It is named simply <CID> with no file extensions.
  // After extracting, we give it a .mp4 file extension.
  const { name, dir } = path.parse(tarFile)
  const mp4File = path.join(process.env.FUTUREPORN_WORKDIR, name)
  const cidFile = path.join(dir, cid)

  const readStream = fs.createReadStream(tarFile)

  const extractStream = tar.extract({
    C: process.env.FUTUREPORN_WORKDIR,
  })

  readStream.pipe(extractStream)

  await new Promise((resolve, reject) => {
    extractStream.once('error', reject);
    extractStream.once('finish', resolve);
  })


  logger.log({ level: 'debug', message: 'renaming the CID file to CID.mp4'})
  logger.log({ level: 'debug', message: `renaming ${cidFile} to ${mp4File}`})

  await rename(
    cidFile,
    mp4File
  )

  return mp4File
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
  if (typeof filename === 'undefined') throw new Error('thumbnail is undefined')
  logger.log({ level: 'debug', message: 'Generating thiccHash Thumbnail...' });
  const tmpDateStamp = new Date().valueOf()
  const thiccThumbnailPath = path.join(os.tmpdir(), `${tmpDateStamp}_thicc.jpg`);
  let thiccOpts = {
    input: filename,
    output: thiccThumbnailPath,
    throttleTimeout: 10000,
    width: 128,
    cols: 5,
    rows: 5,
  };
  let pThicc = new Prevvy(thiccOpts);
  await pThicc.generate();
  const thiccFilePath = pThicc.output;
  return thiccFilePath
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
  if (typeof id === 'undefined') throw new Error('id passed to save() is undef');
  if (typeof video240Hash === 'undefined') throw new Error('video240Hash passed to save() is undef');
  if (typeof thiccHash === 'undefined') throw new Error('thiccHash passed to save() is undef');
  for (let i = 0; i < 5; i++) {
    logger.log({ level: 'info', message: `Saving id:${id}, video240Hash:${video240Hash}, thiccHash:${thiccHash} to db. Attempt ${i+1}` });
    try {
      await sql`UPDATE vod SET "video240Hash" = ${video240Hash} WHERE vod.id = ${id};`
      await sql`UPDATE vod SET "thiccHash" = ${thiccHash} WHERE vod.id = ${id};`
      return 
    } catch (e) {
      logger.log({ level: 'error', message: `error while saving! ${e}` });
      if (i < 4) {
        logger.log({ level: 'info', message: `Retrying the save...` });
      }
    }
  }
}


async function notify () {
  await sql.notify('render/upload', "{}")
}

async function main () {
  const cluster = new Cluster({
    username: process.env.IPFS_CLUSTER_HTTP_API_USERNAME,
    password: process.env.IPFS_CLUSTER_HTTP_API_PASSWORD
  })


  while (true) {
    try {
      logger.log({ level: 'debug', message: 'looking for an unprocessed VOD.' })
      const vod = await find()
      if (vod === null) {
        logger.log({ level: 'info', message: 'there are no unprocessed videos. idling.' })
      } else {
        logger.log({ level: 'debug', message: `the VOD id we are working with is ${vod.id}` })

        // // stat
        // logger.log({ level: 'debug', message: `getting stats of ${vod.videoSrcHash}`})
        // const statRes = await stat(vod.videoSrcHash)
        // const size = statRes.Size
        // logger.log({ level: 'debug', message: `size is ${size} (${JSON.stringify(statRes)})` })

        // download
        logger.log({ level: 'debug', message: `downloading ${vod.videoSrcHash}` })
        const tarFile = await download(vod.videoSrcHash)
        logger.log({ level: 'debug', message: `downloaded:${tarFile}` })
        if (typeof tarFile === 'undefined') throw new Error('download did not return a localFilePath')

        // extract
        logger.log({ level: 'debug', message: `extracting`})
        const filenameSrc = await extract(tarFile, vod.videoSrcHash)

        // thumbnail
        logger.log({ level: 'debug', message: `creating thumbnail` })
        const thumbnailFilePath = await thumbnail(filenameSrc)
        logger.log({ level: 'debug', message: `thumbnail created at ${thumbnailFilePath}`})

        // transcode
        logger.log({ level: 'debug', message: `transcoding ${filenameSrc}`})
        const filename240 = await transcode(filenameSrc)

        // upload
        logger.log({ level: 'debug', message: `uploading ${filename240} and ${thumbnailFilePath}`})
        const up240CID = await cluster.add(filename240)
        logger.log({ level: 'debug', message: `DONE uploading video240Hash ${filename240}. CID:${up240CID}.`})
        const upThumbCID = await cluster.add(thumbnailFilePath)
        logger.log({ level: 'debug', message: `DONE uploading thumbnail ${up240CID}. CID:${upThumbCID}.`})

        logger.log({ level: 'debug', message: JSON.stringify(up240CID) })
        logger.log({ level: 'debug', message: JSON.stringify(upThumbCID) })

        // save
        logger.log({ level: 'debug', message: `saving video240Hash and thumbnail to the db`})
        await save(vod.id, up240CID, upThumbCID)
        logger.log({ level: 'info', message: `SAVED. ✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅` })

        // notify
        await notify()
      }

      logger.log({ level: 'debug', message: `waiting ${delayBetweenAttempts}ms until next run.` })
    } catch (e) {

      logger.log({ level: 'error', message: `problem while running main process-- ${e}` })
    }
    await sleep(delayBetweenAttempts)
  }


}


main()
