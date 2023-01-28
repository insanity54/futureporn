


export default class Capture {

  constructor(opts) {
    this.date = opts?.date
    this.sql = opts.sql
    this.ipfs = opts.ipfs
    this.idleTimeout = opts.idleTimeout || 1000*60*15
    this.actionTimer
    this.video = opts.video
    this.voddo = opts.voddo

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
    console.log(`  [*] saving ${cid} \n      w/ captureDate ${timestamp}`)
    this.date = timestamp
    return await this.sql`INSERT INTO vod ( "videoSrcHash", "captureDate" ) values (${cid}, ${timestamp}) returning *`
  }




  listen() {
    this.sql.listen('scout/stream/stop', function (data) {
      console.log('  [*] scout said the stream has stopped!')
      // cancel the actionTimer started by this.download() and immediately act
      // we do this because this.download() can only assume a stream is over by waiting for 15 minutes without download activity.
      // scout can be sure that a stream is over and doesn't need to wait
      clearTimeout(this.actionTimer)
      this.process(this.voddo.getFilenames())
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

    console.log('  [*] concatenation in progress...')
    const file = await this.video.concat(filenames)

    console.log(`  [*] uploading ${file}`)
    const cid = await this.ipfs.upload(file)

    console.log('  [*] db save in progress')
    await this.save(cid, this.date)
  }


  refreshActionTimer () {
    console.log('  [*] Refreshing actionTimer')
    clearTimeout(this.actionTimer)
    this.actionTimer = setTimeout(() => {
      console.log('  [*] 15 minute actionTimer elapsed. ')
      if (!this.voddo.isDownloading()) {
        console.log('  [*] End of stream is assumed. Processing vod.')
        this.process(this.voddo.getFilenames())
      } else {
        console.log('  [*] stream is still being downloaded, so we are not processing VOD at this time.')
      }
    }, this.idleTimeout)
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
      console.log('  [*] voddo started')
      console.log(data)
      this.sql.notify('capture/file', JSON.stringify(data))
    })
    this.voddo.on('stop', (report) => {
      console.info(`  [*] Got a stop event from Voddo`)
      if (report.reason === 'close') {
        this.refreshActionTimer()
      }
    })
    console.log('  [*] starting voddo')
    this.voddo.start()
  }

}




