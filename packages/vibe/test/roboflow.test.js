

import 'dotenv/config'
import { upload } from '../src/roboflow.js'
import { execa } from 'execa'
import ffmpeg from 'fluent-ffmpeg'
import debugFactory from 'debug'
import postgres from 'postgres'
import VideoLength from 'video-length'

const debug = debugFactory('vibe')

if (typeof process.env.POSTGRES_PASSWORD === 'undefined') throw new Error('POSTGRES_PASSWORD not defined in env');
if (typeof process.env.POSTGRES_USERNAME === 'undefined') throw new Error('POSTGRES_USERNAME not defined in env');
if (typeof process.env.POSTGRES_HOST === 'undefined') throw new Error('POSTGRES_HOST not defined in env');


async function getRandomVod () {
  const sql = postgres({
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    idle_timeout: 1
  })
  const vod = await sql`SELECT "videoSrcHash" FROM vod ORDER BY RANDOM() LIMIT 1`
  return vod
}

// greets chatGPT
function randomFloatBetween(min, max) {
  return Math.random() * (max - min) + min;
}




async function ffmpegGrab (inputFile, time) {
  return new Promise((resolve, reject) => {
    const outputFile = `/tmp/vibe-sample${new Date().valueOf()}.png`
    const command = ffmpeg();
    command
      .addOption('-ss', time)
      .addOption('-i', inputFile)
      .addOption('-frames:v', 1)
      .on('start', (cmd) => debug(`Spawned ffmpeg with command ${cmd}`))
      .on('end', function() {
        resolve(outputFile);
      })
      .on('error', function(e) {
        debug(e);
        reject(e);
      })
      .save(outputFile);
    return command
  })
}


describe('roboflow', function () {

  // NOTE
  // this is a side-effect thing
  // it's only kinda sorta testing roboflow integration
  // really it's mostly using github actions
  // to automate a task that I want to happen
  // on a semi-regular basis
  // that task is getting a random frame from a vod
  // and adding it to the roboflow training dataset
  // so we can train the lovense sensor AI
  // with fresh new data
  // to get better over time
  it('should upload a random frame to Roboflow', async function () {
    this.timeout(1000*60*3)

    try {
      const vod = await getRandomVod()
      debug(vod)
      const cid = vod[0].videoSrcHash
      debug(`  [*] randomVodCid: ${cid}`)
      const url = `https://ipfs.io/ipfs/${cid}`
      debug(`  [*] url:${url}`)

      const videoDuration = await VideoLength(url, {
        bin: '/usr/bin/mediainfo'
      })
      debug(`  [*] videoDuration:${videoDuration}`)
      const randomTime = randomFloatBetween(60*5, videoDuration)
      debug(`  [*] randomTime:${randomTime}`)
      const frameFilename = await ffmpegGrab(url, randomTime)
      debug(`  [*] frameFilename:${frameFilename}`)
      return upload(frameFilename)

    } catch (e) {
      return e.message
    }

  })
})
