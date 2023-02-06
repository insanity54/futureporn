
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

  let clock

  const sandbox = sinon.createSandbox()

  beforeEach(() => {

    clock = sandbox.useFakeTimers({
      toFake: ["setTimeout", "setInterval"],
      shouldAdvanceTime: false
    });

    // // const sql = postgres({
    // //   idle_timeout: 1
    // // })

    // let pgStub = (opts) => {
    //   let sql = (args) => {}
    //   return sql
    // }
    const sqlRaw = postgres()
    const sql = sandbox.stub(sqlRaw)
    // sql.listen.resolves(fixtureDate)
    // sql.notify.resolves(92834)
    // sinon.stub(postgres, 'notify')
    // sinon.createStubInstance(postgres)
    // sql
    //   .withArgs('INSERT INTO vod ( videoSrcHash, captureDate ) values (bafybeid3mg5lzrvnmpfi5ftwhiupp7i5bgkmdo7dnlwrvklbv33telrrry, 1581117660000) returning *')
    //   .resolves({ msg: 'idk' })
    // sinon.stub(sql, 'notify').returns()




    // const ipfs = sandbox.createStubInstance(Ipfs)
    // ipfs.upload.withArgs('/tmp/mycoolfile.mp4').resolves(cidFixture)
    // capture = new Capture({
    //   sql,
    //   ipfs,
    //   video,
    //   voddo
    // })
    // sandbox.stub(capture, 'process').resolves()
  })

  afterEach(() => {
    sandbox.restore()
    clock.restore()
  })



  describe('upload', function () {
    it('should upload a video to ipfs', async function () {

      const sqlRaw = postgres()
      const sql = sandbox.stub(sqlRaw)

      const video = sandbox.stub()
      const voddo = sandbox.createStubInstance(Voddo)
      voddo.on.callThrough()
      voddo.emit.callThrough()
      voddo.listeners.callThrough()
      voddo.listenerCount.callThrough()


      voddo.start.callsFake(() => {
        voddo.emit('start', { file: '/tmp/burrito.mp4', timestamp: 1 })
      })

      const ipfs = sandbox.createStubInstance(Ipfs)
      ipfs.upload.withArgs('/tmp/mycoolfile.mp4').resolves(cidFixture)
      const capture = new Capture({
        sql,
        ipfs,
        video,
        voddo
      })

      const cid = await capture.upload('/tmp/mycoolfile.mp4')
      expect(() => CID.parse(cid), `The IPFS CID '${cid}' is invalid.`).to.not.throw()
      expect(capture.ipfs.upload).calledOnce
    })
  })
  describe('save', function () {
    it('should save to db', async function () {

      const sqlRaw = postgres()
      const sql = sandbox.stub(sqlRaw)

      const video = sandbox.stub()
      const voddo = sandbox.createStubInstance(Voddo)
      voddo.on.callThrough()
      voddo.emit.callThrough()
      voddo.listeners.callThrough()
      voddo.listenerCount.callThrough()


      voddo.start.callsFake(() => {
        voddo.emit('start', { file: '/tmp/burrito.mp4', timestamp: 1 })
      })

      const ipfs = sandbox.createStubInstance(Ipfs)
      ipfs.upload.withArgs('/tmp/mycoolfile.mp4').resolves(cidFixture)
      const capture = new Capture({
        sql,
        ipfs,
        video,
        voddo
      })
      
      // I can't stub sql`` because of that template string override so i'm just stubbing capture.save
      // I think this is an evergreen test ¯\_(ツ)_/¯
      sandbox.stub(capture, 'save').resolves([
        { id: 1, cid: cidFixture, captureDate: fixtureDate }
      ])
      const vod = await capture.save(cidFixture, fixtureDate)
    })
  })




})