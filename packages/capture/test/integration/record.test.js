import { record, assertDependencyDirectory } from '../../src/record.js'
import { getRandomRoom } from '../../src/cb.js'
import path from 'node:path'
import os from 'node:os'
import { execa } from 'execa'

describe('record', function() {
  it('should record a file to disk', async function () {
    this.timeout(1000*60)
    const roomName = await getRandomRoom()
    console.log(`roomName:${roomName}`)
    const appContext = {
      env: {
        FUTUREPORN_WORKDIR: os.tmpdir(),
        DOWNLOADER_UA: "Mozilla/5.0 (X11; Linux x86_64; rv:105.0) Gecko/20100101 Firefox/105.0"
      },
      logger: {
        log: (msg) => { console.log(JSON.stringify(msg)) }
      }
    }
    console.log(appContext)
    const { stdout } = await execa('yt-dlp', ['-g', `https://chaturbate.com/${roomName}`])
    const playlistUrl = stdout.trim()
    console.log(`playlistUrl:${playlistUrl}`)
    assertDependencyDirectory(appContext)
    const ffmpegProc = record(appContext, playlistUrl, roomName)
    // console.log(ffmpegProc)
    return new Promise((resolve) => {
      setTimeout(() => {
        ffmpegProc.kill('SIGINT')
        resolve()
      }, 1000*10)
    })
  })
})