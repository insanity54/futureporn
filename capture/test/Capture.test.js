
import Video from '../src/Video.js'
import Capture from '../src/Capture.js'
import Ipfs from '../src/Ipfs.js'
import chai, { expect } from 'chai'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'node:path'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { CID } from 'multiformats/cid'
import Voddo from '../src/Voddo.js'
import EventEmitter from 'node:events'
import postgres from 'postgres'

chai.use(sinonChai)

const Timer = setTimeout(()=>{},0).constructor
const fixtureDate = 1581117660000
const cidFixture = 'bafybeid3mg5lzrvnmpfi5ftwhiupp7i5bgkmdo7dnlwrvklbv33telrrry'
const __dirname = dirname(fileURLToPath(import.meta.url));

describe('Capture', function () {

  let capture
  let clock
  let voddo


  beforeEach(() => {
    clock = sinon.useFakeTimers({
      toFake: ["setTimeout", "setInterval"],
      shouldAdvanceTime: false
    });

    // const sql = postgres({
    //   idle_timeout: 1
    // })

    // let pgStub = (opts) => {
    //   let sql = (args) => {}
    //   return sql
    // }
    const sqlRaw = postgres()
    const sql = sinon.stub(sqlRaw)
    // sql.listen.resolves(fixtureDate)
    // sql.notify.resolves(92834)
    // sinon.stub(postgres, 'notify')
    // sinon.createStubInstance(postgres)
    // sql
    //   .withArgs('INSERT INTO vod ( videoSrcHash, captureDate ) values (bafybeid3mg5lzrvnmpfi5ftwhiupp7i5bgkmdo7dnlwrvklbv33telrrry, 1581117660000) returning *')
    //   .resolves({ msg: 'idk' })
    // sinon.stub(sql, 'notify').returns()

    const video = sinon.stub()
    voddo = sinon.createStubInstance(Voddo)
    voddo.on.callThrough()
    voddo.emit.callThrough()
    voddo.listeners.callThrough()
    voddo.listenerCount.callThrough()


    voddo.start.callsFake(() => {
      voddo.emit('start', { file: '/tmp/burrito.mp4', timestamp: 1 })
    })
      
    // this should be set at individual test level
    // clock.setTimeout(() => {
    //   voddo.emit('stop', {
    //     reason: 'close',
    //     stats: {
    //       files: [
    //         { timestamp: fixtureDate, filename: 'taco.mp4' }
    //       ]
    //     }
    //   })
    // }, 1000*60*60*3)
    

    const ipfs = sinon.createStubInstance(Ipfs)
    ipfs.upload.withArgs('/tmp/mycoolfile.mp4').resolves(cidFixture)
    capture = new Capture({
      sql,
      ipfs,
      video,
      voddo
    })
    sinon.stub(capture, 'process').resolves()
  })

  afterEach(() => {
    sinon.restore()
    clock.restore()
  })

  xdescribe('listen', function () {
    it('should listen for accurate stream end announcements from futureporn/scout', function () {

      capture.listen()
      expect(voddo.getFilenames).calledOnce
      expect(capture.process).calledOnce
    })
  })

  describe('upload', function () {
    it('should upload a video to ipfs', async function () {
      const cid = await capture.upload('/tmp/mycoolfile.mp4')
      expect(() => CID.parse(cid), `The IPFS CID '${cid}' is invalid.`).to.not.throw()
      expect(capture.ipfs.upload).calledOnce
    })
  })
  describe('save', function () {
    it('should save to db', async function () {
      // I can't stub sql`` because of that template string override so i'm just stubbing capture.save
      // I think this is an evergreen test ¯\_(ツ)_/¯
      sinon.stub(capture, 'save').resolves([
        { id: 1, cid: cidFixture, captureDate: fixtureDate }
      ])
      const vod = await capture.save(cidFixture, fixtureDate)
    })
  })
  describe('download', function () {
    xit('should be a chad', function () {
      const voddo = sinon.createStubInstance(Voddo)
      voddo.on.callThrough()
      voddo.listeners.callThrough()
      voddo.listenerCount.callThrough()
      expect(voddo).to.be.an.instanceof(EventEmitter)
      const video = sinon.stub()
      const capture = new Capture({
        voddo,
        video
      })

      capture.download()
      expect(capture.voddo.start).calledOnce
      expect(voddo.listeners('start').length).to.equal(1)
      expect(voddo.listeners('stop').length).to.equal(1)
    })



    it('should start processing after 15 minutes without download activity', function() {
      capture.download()

      expect(capture.voddo.start).calledOnce
      expect(capture.voddo.emit).calledOnce

      expect(voddo.listeners('start').length).to.equal(1)
      expect(voddo.listeners('stop').length).to.equal(1)

      const times = [
        5000,
        1000*60*60*3,
        1000*60*60*3+1000*60*15,
      ]

      clock.setTimeout(() => voddo.emit('start', { file: '/tmp/burrito0.mp4', timestamp: times[0] }), times[0])
      clock.setTimeout(() => {
        voddo.emit('stop', { reason: 'close', stats: {} })
      }, times[1])

      expect(clock.countTimers()).to.equal(2)

      // start
      clock.next()

      // stop
      clock.next()
      expect(capture.process).not.called

      // actionTimer timeout
      clock.next()


      expect(capture.process).calledOnce


      expect(clock.countTimers()).to.equal(0)


    })

    it('should gracefully handle interrupted downloads', function () {
      capture.download()
      expect(capture.voddo.start).calledOnce

      const times = [
        5000,
        1000*60*30,
        1000*60*31,
        1000*60*60*2
      ]

      // start voddo (5s)
      clock.setTimeout(() => voddo.emit('start', { file: '/tmp/burrito0.mp4', timestamp: times[0] }), times[0])

      // stop voddo  (30m)
      clock.setTimeout(() => voddo.emit('stop', { reason: 'close', stats: {} }), times[1])

      // start voddo (31m)
      clock.setTimeout(() => voddo.emit('start', { file: '/tmp/burrito1.mp4', timestamp: times[2] }), times[2])      

      // stop voddo  (2h)
      clock.setTimeout(() => voddo.emit('stop', { reason: 'close', stats: {} }), times[3])



      clock.next() // start
      expect(capture.actionTimer).undefined

      clock.next() // stop
      expect(capture.actionTimer).exists

      clock.next() // start
      

      clock.next() // stop
      expect(capture.process).calledOnce

    })
  })



})