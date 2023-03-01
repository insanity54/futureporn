

import roboflow from '../src/roboflow.js'


async function sampleImageUpload () {
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
  const res = await upload(frameFilename)
  debug(res)
}


async function main () {
  
}