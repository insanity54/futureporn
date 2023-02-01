import 'dotenv/config'
import Voddo from '../src/Voddo.js'
import {
  expect
} from 'chai'
import sinon from 'sinon'
import YoutubeDlWrap from 'youtube-dl-wrap'
import {
  AbortController
} from "node-abort-controller";
import {
  EventEmitter
} from 'events'
import debugFactory from 'debug'
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));


const debug = debugFactory('voddo')


describe('voddo', function() {
  let clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers({
      toFake: ["setTimeout", "setInterval"],
      shouldAdvanceTime: false
    });
  })

  afterEach(function() {
    sinon.restore();
  })


  describe('getFilenames', function() {
    it('should populate it\'s log if log is empty', async function () {
      const voddo = new Voddo({
        url: 'https://example.com',
        cwd: join(__dirname, 'fixtures')
      })
      const filenames = await voddo.getFilenames()
      expect(filenames.length).to.equal(3)
      expect(filenames[0]).to.have.property('timestamp')
      expect(filenames[0]).to.have.property('file')
      expect(filenames[0]).to.have.property('size')
    })
    it('should use Voddo\'s stats history to get filenames of only the most recent stream', async function() {
      const voddo = new Voddo({
        url: 'https://example.com',
        cwd: '~/Downloads'
      })
      sinon.stub(voddo, 'stats').value({
        files: [{
          timestamp: 1674147647000,
          size: 192627,
          file: 'projektmelody 2023-01-19 17_00-projektmelody.mp4'
        }, {
          timestamp: 1674151247000,
          size: 192627,
          file: 'projektmelody 2023-01-19 18_00-projektmelody.mp4'
        }, {
          timestamp: 1674154847000,
          size: 192627,
          file: 'projektmelody 2023-01-19 19_00-projektmelody.mp4'
        }, {
          file: 'projektmelody 2023-01-20 20_10-projektmelody.mp4',
          size: 192627,
          timestamp: 1674245400000
        }, {
          file: 'projektmelody 2023-01-20 21_10-projektmelody.mp4',
          size: 192627,
          timestamp: 1674249000000
        }, {
          file: 'projektmelody 2023-01-20 22_10-projektmelody.mp4',
          size: 192627,
          timestamp: 1674252600000
        }]
      })

      const filenames = await voddo.getFilenames()
      expect(filenames).to.have.lengthOf(3)
      expect(filenames).to.deep.equal([{
        file: 'projektmelody 2023-01-20 20_10-projektmelody.mp4',
        size: 192627,
        timestamp: 1674245400000
      }, {
        file: 'projektmelody 2023-01-20 21_10-projektmelody.mp4',
        size: 192627,
        timestamp: 1674249000000
      }, {
        file: 'projektmelody 2023-01-20 22_10-projektmelody.mp4',
        size: 192627,
        timestamp: 1674252600000
      }])
    })
  })


  it('should keep a log of the files downloaded', function(done) {
    const ee = new EventEmitter()


    const ytdl = sinon.createStubInstance(YoutubeDlWrap)
    ytdl.exec.returns(ee)
    console.log(ytdl)


    const times = [
      1000, // start
      1000 * 60 * 60 * 1, // stop
      1000 * 60 * 60 * 1 + 1, // start
      1000 * 60 * 60 * 2, // stop
      1000 * 60 * 60 * 3 + 1, // start
      1000 * 60 * 60 * 4 // stop
    ]

    clock.setTimeout(() => {
      console.log('  [*] time0!')
      ee.emit('youtubeDlEvent', 'download', ' Destination: projektmelody 2023-01-18 21_10-projektmelody.mp4')
    }, times[0])

    clock.setTimeout(() => {
      console.log('  [*] time1!')
      ee.emit('close')
    }, times[1])

    clock.setTimeout(() => {
      console.log('  [*] time2!')
      ee.emit('youtubeDlEvent', 'download', ' Destination: projektmelody 2023-01-18 22_10-projektmelody.mp4')
    }, times[2])

    clock.setTimeout(() => {
      console.log('  [*] time3!')
      ee.emit('close')
    }, times[3])

    clock.setTimeout(() => {
      console.log('  [*] time4!')
      ee.emit('youtubeDlEvent', 'download', ' Destination: projektmelody 2023-01-18 23_10-projektmelody.mp4')
    }, times[4])

    clock.setTimeout(() => {
      console.log('  [*] time5!')
      ee.emit('close')
    }, times[5])


    let url = `https://chaturbate.com/projektmelody`
    let cwd = process.env.FUTUREPORN_WORKDIR || '/tmp'
    const voddo = new Voddo({
      url: url,
      format: 'best',
      cwd: cwd,
      ytdl
    })

    voddo.once('start', (data) => {
      expect(data).to.have.property('file')
      expect(data).to.have.property('timestamp')

      voddo.once('start', (data) => {
        expect(data).to.have.property('file')
        expect(data).to.have.property('timestamp')

        voddo.once('start', (data) => {
          expect(data).to.have.property('file')
          expect(data).to.have.property('timestamp')

          voddo.once('stop', function(report) {
            debug(report)
            expect(report).to.have.property('stats')
            expect(report.stats).to.have.property('files')
            expect(report.stats.files).to.have.lengthOf(3)
            debug(report.stats.files)
            expect(report.stats.files[0]).to.include({
              file: 'projektmelody 2023-01-18 21_10-projektmelody.mp4'
            })

            // expect(clock.countTimers()).to.equal(0)
            expect(ytdl.exec).calledThrice
            done()
          })
          clock.tick(times[5]) // stop

        })
        clock.tick(times[3]) // stop
        clock.tick(times[4]) // start

      })
      clock.tick(times[1]) // stop
      clock.tick(times[2]) // start

    })


    voddo.start()
    expect(ytdl.exec).calledOnce

    clock.tick(times[0])




  })

  xit('should keep a log of the files downloaded', function(done) {
    this.timeout(5000)
      // https://github.com/insanity54/futureporn/issues/13
    const ytdlStub = sinon.createStubInstance(YoutubeDlWrap)
    ytdlStub.exec
      .onCall(0)
      .callsFake(function(args, opts, aborter) {
        console.log('exec was called 0')
        let ee = new EventEmitter()
        clock.setTimeout(() => {
          console.log('ytdl dl event')
          ee.emit('youtubeDlEvent', 'download', ' Destination: projektmelody 2023-01-18 21_10-projektmelody.mp4')
        }, 50)
        clock.setTimeout(() => {
          console.log('ytdl close event')
          ee.emit('close')
        }, 100)
        return ee
      })
      .onCall(1)
      .callsFake(function(args, opts, aborter) {
        let ee = new EventEmitter()
        clock.setTimeout(() => {
          ee.emit('youtubeDlEvent', 'download', ' Destination: projektmelody 2023-01-18 22_10-projektmelody.mp4')
        }, 50)
        clock.setTimeout(() => {
          ee.emit('close')
        }, 100)
        return ee
      })
      .onCall(2)
      .callsFake(function(args, opts, aborter) {
        let ee = new EventEmitter()
        clock.setTimeout(() => {
          ee.emit('youtubeDlEvent', 'download', ' Destination: projektmelody 2023-01-18 23_10-projektmelody.mp4')
        }, 50)
        clock.setTimeout(() => {
          ee.emit('close')
        }, 100)
        return ee
      })
    let url = `https://chaturbate.com/projektmelody`
    let cwd = process.env.FUTUREPORN_WORKDIR || '/tmp'

    const voddo = new Voddo({
      url: url,
      format: 'best',
      cwd: cwd,
      ytdl: ytdlStub
    })

    // expect(clock.countTimers()).to.equal(0)
    voddo.once('start', function(data) {
      expect(data).to.have.property('file')
      expect(data).to.have.property('timestamp')

      clock.next()
      clock.next()
      voddo.once('start', function(data) {
        expect(data).to.have.property('file')
        expect(data).to.have.property('timestamp')

        voddo.once('start', function(data) {
          debug('fake start?')
          expect(data).to.have.property('file')
          expect(data).to.have.property('timestamp')

          voddo.once('stop', function(report) {
            debug(report)
            expect(report).to.have.property('stats')
            expect(report.stats).to.have.property('files')
            expect(report.stats.files).to.have.lengthOf(3)
            debug(report.stats.files)
            expect(report.stats.files[0]).to.include({
              file: 'projektmelody 2023-01-18 21_10-projektmelody.mp4'
            })

            sinon.assert.calledThrice(ytdlStub.exec)
            done()
          })


        })
      })
    })

    voddo.start()
  })


  it('should start and stop stream download', function(done) {
    const ytdlStub = sinon.createStubInstance(YoutubeDlWrap);
    ytdlStub.exec
      .callsFake(function(args, opts, aborter) {
        aborter.onabort = (idk) => {
          debug('  [*] aborter has been aborted')
          debug(idk)
          ee.emit('close')
        }
        debug('  [test] callsFake 0')
        let ee = new EventEmitter()
        setTimeout(() => {
          ee.emit('youtubeDlEvent', 'download', ' Destination: projektmelody 2023-01-17 19_39-projektmelody.mp4')
        }, 100)
        return ee
      })

    const url = 'https://chaturbate.com/projektmelody'
    const format = 'best'
    const cwd = '/tmp'
    const ytdl = ytdlStub
    const voddo = new Voddo({
      url,
      format,
      cwd,
      ytdl
    })
    voddo.once('stop', function(data) {
      debug('ffffff')
      expect(this.abortController.signal.aborted).to.be.true
      done()
    })
    voddo.once('start', function(data) {
      expect(data).to.have.property('file')
      expect(data).to.have.property('timestamp')
      expect(this).to.have.property('abortController')
      debug('ey cool, voddo started')
      setTimeout(() => {
        this.stop() // 'this' is Voddo
      }, 500)
    })
    voddo.start()

    clock.next()
    clock.next()
    clock.next()

  })


  it('should retry when a stream closes', function(done) {

    const ytdlStub = sinon.createStubInstance(YoutubeDlWrap);
    ytdlStub.exec
      .onCall(0)
      .callsFake(function(args, opts, aborter) {
        debug('  [test] callsFake 0')
        let ee = new EventEmitter()
        setTimeout(() => {
          ee.emit('youtubeDlEvent', 'download', ' Destination: projektmelody 2023-01-17 19_39-projektmelody.mp4')
        }, 100)
        setTimeout(() => {
          // this simulates youtube-dl closing
          // (NOT Voddo closing)
          ee.emit('close')
        }, 550)
        return ee
      })
      .onCall(1)
      .callsFake(function(args, opts, aborter) {
        debug('  [test] callsFake 1')
        let ee = new EventEmitter()
        setTimeout(() => {
          ee.emit('youtubeDlEvent', 'download', ' Destination: projektmelody 2023-01-17 19_45-projektmelody.mp4')
        }, 100)
        return ee
      })
    let url = `https://chaturbate.com/projektmelody`
    let cwd = process.env.FUTUREPORN_WORKDIR || '/tmp'
    let abortController = new AbortController()

    const voddo = new Voddo({
      url: url,
      format: 'best',
      cwd: cwd,
      ytdl: ytdlStub
    })

    voddo.once('start', function(data) {
      debug('  [test] voddo <<<<<-----')
      expect(data).to.have.property('file')
      expect(data).to.have.property('timestamp')

      voddo.once('start', function(data) {
        debug('  [test] restarted after dl close! (expected) <<<<<-----')

        sinon.assert.calledTwice(ytdlStub.exec)
        done()
      })
    })

    voddo.start()

    clock.next()
    clock.next()
    clock.next()
    clock.next()
    clock.next()

  })

})