


export default class Capture {

  constructor(opts) {
    this.date = opts?.date
    this.sql = opts.sql
    this.ipfsClusterUpload = opts.ipfsClusterUpload
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
    const cid = await this.ipfsClusterUpload(filename)
    return cid
  }



  /**
   * save Vod data to db
   */
  async save (cid, timestamp) {
    console.log(`  saving ${cid} w/ timestamp ${timestamp}`)
    this.date = timestamp
    return await this.sql`INSERT INTO vod ( videoSrcHash, lastUpdatedAt ) values (${cid}, ${timestamp}) returning *`
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

    console.log('  [*] upload in progress')
    const cid = await this.ipfsClusterUpload(file)

    console.log('  [*] db save in progress')
    await this.save(cid)
  }


  refreshActionTimer () {
    console.log('  [*] Refreshing actionTimer')
    clearTimeout(this.actionTimer)
    this.actionTimer = setTimeout(() => {
      console.log('  [*] 15 minute actionTimer elapsed. ')
      if (!this.voddo.isDownloading()) {
        console.log('  [*] stream is not being downloaded, so we are proceeding with VOD processing. (end of stream is assumed)')
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
      // if (report.reason !== 'close' && !report.error.match(/currently offline/)) {
      //   console.error(report.error)
      // } else {
      //   // process/upload if stream has been stopped for 15 minutes
        
      // }
    })
    console.log('  [*] starting voddo')
    this.voddo.start()
  }

}




