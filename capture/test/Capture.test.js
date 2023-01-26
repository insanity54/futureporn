
import Video from '../src/Video.js'
import Capture from '../src/Capture.js'
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
      shouldAdvanceTime: true
    });

    // let pgStub = (opts) => {
    //   let sql = (args) => {}
    //   return sql
    // }
    const sqlRaw = postgres()
    const sql = sinon.stub(sqlRaw)
    sql.notify.resolves(92834)
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
      
    clock.setTimeout(() => {
      voddo.emit('stop', {
        reason: 'close',
        stats: {
          files: [
            { timestamp: fixtureDate, filename: 'taco.mp4' }
          ]
        }
      })
    }, 1000*60*60*3)
    

    const ipfsClusterUpload = sinon.stub()
    ipfsClusterUpload.withArgs('/tmp/mycoolfile.mp4').resolves(cidFixture)
    capture = new Capture({
      sql,
      ipfsClusterUpload,
      video,
      voddo
    })
    sinon.stub(capture, 'process').resolves()
  })

  afterEach(() => {
    sinon.restore()
    clock.restore()
  })

  describe('upload', function () {
    it('should upload a video to ipfs', async function () {
      const cid = await capture.upload('/tmp/mycoolfile.mp4')
      expect(() => CID.parse(cid), `The IPFS CID '${cid}' is invalid.`).to.not.throw()
      expect(capture.ipfsClusterUpload).calledOnce
    })
  })
  xdescribe('save', function () {
    it('should save to db', async function () {
      const vodId = await capture.save(cidFixture, fixtureDate)
      expect(capture.video).not.called
      expect(capture.ipfsClusterUpload).not.called
      expect(capture.date, 'the date was not set by save()').to.equal(fixtureDate)
      expect(capture.sql).calledOnce
      // @todo assert response format
    })
  })
  describe('download', function () {
    it('should be a chad', function () {
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

      // wait for simulated 3 hour stream
      clock.next()
      

      expect(clock.countTimers()).to.equal(1)

      // wait for simulated actionTimer to elapse
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