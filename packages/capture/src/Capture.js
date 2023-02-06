
import Voddo from './Voddo.js'
import {loggerFactory} from 'common/logger'

const logger = loggerFactory({
  service: 'futureporn/capture'
})

export default class Capture {

  constructor(opts) {
    this.date = opts?.date
    this.sql = opts.sql
    this.ipfs = opts.ipfs
    this.idleTimeout = opts.idleTimeout || 1000*60*15
    this.video = opts.video
    this.voddo = opts.voddo
    this.workerId = opts.workerId
    return this
  }


  /**
   * upload VOD to ipfs
   * 
   * @return {Promise}
   * @resolves {String} cid
   */
  async upload (filename) {
    const cid = await this.ipfs.upload(filename)
    return cid
  }



  /**
   * save Vod data to db
   */
  async save (cid, timestamp) {
    logger.log({ level: 'debug', message: `saving ${cid} \n      w/ captureDate ${timestamp}` })
    this.date = timestamp
    return await this.sql`INSERT INTO vod ( "videoSrcHash", "captureDate" ) values (${cid}, ${timestamp}) returning *`
  }


  /**
   * advertise the vod segment(s) we captured.
   * futureporn/commander uses this data to elect one worker to upload the VOD
   */
  async advertise () {
    const segments = await this.voddo.getRecordedSegments()
    const streams = Voddo.groupStreamSegments(segments)
    const workerId = this.workerId
    logger.log({ level: 'debug', message: `Advertising our VOD streams(s) ${JSON.stringify({segments, streams, workerId})}` })
    this.sql.notify('capture/vod/advertisement', JSON.stringify({segments, streams, workerId}))
  }


  listen () {
    this.sql.listen('scout/stream/stop', (data) => {
      logger.log({ level: 'debug', message: 'Scout said the stream has stopped. I will advertise the vod segment(s) I have.' })
      this.advertise()
    })

    this.sql.listen('commander/vod/election', async (data) => {
      if (data.workerId === this.workerId) {
        logger.log({ level: 'debug', message: 'Commander elected me to process/upload' })
        this.process(await this.voddo.getFilenames())
      } else {
        logger.log({ level: 'debug', message: `Commander elected ${data.workerId} to process/upload their vod segment(s)` })
      }
    })

    return this
  }


  /**
   * process video(s) after end of stream
   *
   * @param {String[]} filenames
   * @returns {void}
   */
  async process (filenames) {
    this.date = filenames[0].timestamp

    logger.log({ level: 'debug', message: 'concatenation in progress...' })
    const file = await this.video.concat(filenames)

    logger.log({ level: 'debug', message: `uploading ${file}` })
    const cid = await this.ipfs.upload(file)

    logger.log({ level: 'debug', message: 'db save in progress' })
    await this.save(cid, this.date)

  }



  /**
   * download a livestream
   * 
   *   - initializes Voddo
   *   - invokes this.process() as side effect
   * 
   * @return {void}
   */
  async download () {
    this.voddo.on('start', (data) => {
      logger.log({ level: 'debug', message: 'voddo started' })
      logger.log({ level: 'debug', message: data })
      this.sql.notify('capture/file', JSON.stringify(data))
    })
    this.voddo.on('stop', (report) => {
      logger.log({ level: 'debug', message: `Got a stop event from Voddo` })
    })
    logger.log({ level: 'debug', message: 'starting voddo' })
    this.voddo.start()
  }

}




