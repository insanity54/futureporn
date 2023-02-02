import 'dotenv/config'
import Voddo from '../src/Voddo.js'
import {
  expect
} from 'chai'
import sinon from 'sinon'
import YoutubeDlWrap from 'youtube-dl-wrap'
import {
  EventEmitter
} from 'events'
import { getRandomRoom } from '../src/cb.js'



describe('voddo', function() {


  describe('getVideoLength', function () {
    it('should return the video length in ms', async function () {
      const fixtureFile = path.join(__dirname, './fixtures', 'mock-stream0.mp4')
      const length = await Voddo.getVideoLength(fixtureFile)
      expect(length).to.equal(3819)
    })
  })

  it('aborted stream', function(done) {
    this.timeout(10000)

    getRandomRoom().then((room) => {
      console.log(room)
      const abortController = new AbortController()

      const url = `https://chaturbate.com/${room}`
      const format = 'best'
      const cwd = '/tmp'
      const voddo = new Voddo({
        url,
        format,
        cwd
      })


      voddo.once('stop', function(data) {
        console.log('f in chat')
        expect(voddo.stats.files[0]).to.have.property('size')
        done()
      })

      voddo.start()

      setTimeout(() => {
        voddo.stop()
      }, 5000)
    })


  })


})