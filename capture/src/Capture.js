


export default class Capture {

  constructor({ opts }) {
    this.date = opts?.date
    this.sql = opts.sql
    this.ipfsClusterUpload = opts.ipfsClusterUpload
    this.idleTimeout = opts.idleTimeout || 1000*60*15
    this.actionTimer
    this.concat = opts

    return this
  }


  /**
   * upload VOD to ipfs
   * 
   * @return {Promise}
   * @resolves {String} cid
   */
  async upload () {
    this.ipfsCluster.add()
  }



  /**
   * save Vod data to db
   */
  async save (cid) {

  }



  begin () {
    let complete = false
    while (!complete) {
      this.listen()
    }
  }


  // listen() {
  //   const idk = await sql.listen('scout/stream/stop', function () {
  //     console.log('  [*] scout said the stream has stopped!')
  //     // cancel the actionTimer started by this.download() and immediately act
  //     // we do this because this.download() can only assume a stream is over by waiting for 15 minutes without download activity.
  //     // scout can be sure that a stream is over and doesn't need to wait
  //     clearTimeout(this.actionTimer)
  //     this.process(this.voddo.getFilenames())
  //   })
  // }


  /**
   * process video(s) after end of stream
   *
   * @param {String[]} filenames
   * @returns {void}
   */
  async process (filenames) {
    console.log('  [*] concatenation in progress...')
    const file = await this.video.concat(filenames)

    console.log('  [*] upload in progress')
    const cid = await this.ipfsClusterUpload(file)

    console.log('  [*] db save in progress')
    await this.save(cid)
  }


  /**
   * download a livestream
   * 
   * @return {Promise}
   * @resolve {String[]} filenames
   */
  async download () {
    this.voddo.on('start', (data) => {
      console.log('  [*] voddo started')
      console.log(data)
      this.sql.notify('capture/file', JSON.stringify(data))  
    })
    this.voddo.on('stop', (report) => {
      console.log('  [*] voddo stopped')
      console.log(report)
      // saveMetadata(report) // do we need this?
      // @todo detect stream end (scout signal?)
      if (report.reason !== 'close') {
        console.warn('Voddo stopped irregularly.')
        console.warn(report.reason)
      } else {
        // process/upload if stream has been stopped for 15 minutes
        clearTimeout(actionTimer)
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
    })
    this.voddo.start()
  }

}




