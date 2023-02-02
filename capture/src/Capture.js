
import debugFactory from 'debug'
import Voddo from './Voddo.js'

const debug = debugFactory('futureporn/capture')


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
    debug(`  [*] saving ${cid} \n      w/ captureDate ${timestamp}`)
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
    debug(`  [*] Advertising our VOD streams(s) ${JSON.stringify({segments, streams, workerId})}`)
    this.sql.notify('capture/vod/advertisement', JSON.stringify({segments, streams, workerId}))
  }


  listen () {
    this.sql.listen('scout/stream/stop', (data) => {
      debug('  [*] Scout said the stream has stopped. I will advertise the vod segment(s) I have.')
      this.advertise()
    })

    this.sql.listen('commander/vod/election', async (data) => {
      if (data.workerId === this.workerId) {
        debug('  [*] Commander elected me to process/upload')
        this.process(await this.voddo.getFilenames())
      } else {
        debug(`  [*] Commander elected ${data.workerId} to process/upload their vod segment(s)`)
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

    debug('  [*] concatenation in progress...')
    const file = await this.video.concat(filenames)

    debug(`  [*] uploading ${file}`)
    const cid = await this.ipfs.upload(file)

    debug('  [*] db save in progress')
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
      debug('  [*] voddo started')
      debug(data)
      this.sql.notify('capture/file', JSON.stringify(data))
    })
    this.voddo.on('stop', (report) => {
      debug(`  [*] Got a stop event from Voddo`)
    })
    debug('  [*] starting voddo')
    this.voddo.start()
  }

}




