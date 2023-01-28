import 'dotenv/config'
import chai, { expect } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { CID } from 'multiformats/cid'
import EventEmitter from 'node:events'
import { fileURLToPath } from 'url';
import path from 'node:path'
import postgres from 'postgres'
import Capture from '../src/Capture.js'
import Voddo from '../src/Voddo.js'
import Video from '../src/Video.js'

chai.use(sinonChai)

if (typeof process.env.POSTGRES_PASSWORD === 'undefined') throw new Error('missing POSTGRES_PASSWORD');
if (typeof process.env.POSTGRES_USERNAME === 'undefined') throw new Error('missing POSTGRES_USERNAME');


const cidFixture = 'bafybeid3mg5lzrvnmpfi5ftwhiupp7i5bgkmdo7dnlwrvklbv33telrrry'
const inputFixture = 'projektmelody 3021-10-16 06-16.mp4'
const outputFixture = 'projektmelody-chaturbate-30211016T000000Z.mp4'
const timestampFixture = 33191316900000

describe('Capture integration', function () {

  let clock

  beforeEach(() => {
    clock = sinon.useFakeTimers({
      toFake: ["setTimeout", "setInterval"],
      shouldAdvanceTime: false
    });
  })

  afterEach(() => {
    sinon.restore()
    clock.restore()
  })

  it('end of stream behavior', async function() {
    const ipfsClusterUpload = sinon.mock()
      .withExactArgs(outputFixture)
      .resolves(cidFixture)

    const sql = postgres({
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.POSTGRES_HOST,
      database: 'futureporn',
      idle_timeout: 1
    })


    const voddo = sinon.createStubInstance(Voddo)
    voddo.on.callThrough()
    voddo.off.callThrough()
    voddo.emit.callThrough()
    voddo.listeners.callThrough()
    voddo.listenerCount.callThrough()
    voddo.getFilenames.returns([{
      timestamp: timestampFixture,
      filename: inputFixture
    }])

    const video = sinon.createStubInstance(Video)
    video.concat.resolves(outputFixture)

    const capture = new Capture({
      voddo,
      sql,
      ipfsClusterUpload,
      video
    })

    capture.download()
    voddo.emit('stop', {
      reason: 'close',
      stats: {
        filenames: [
          inputFixture
        ]
      }
    })

    clock.next() // actionTimer elapse


    expect(clock.countTimers()).to.equal(0)
    clock.restore()

    // gotta wait to verify otherwise verification
    // occurs before ipfsClusterUpload has a chance
    // to be invoked. 
    //
    // (not sure why)
    // 
    // maybe we're waiting for the 
    // concat promise to resolve?

    await Promise.resolve(() => {
      expect(ipfsClusterUpload).calledOnce
    })

    // Capture.save is called as a side effect
    // of Capture.process
    // which is called as a side effect of Capture.download
    // so we have to wait for it to complete
    // this is not ideal because there is potential
    // to not wait long enough
    await new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })

    const rows = await sql`SELECT "videoSrcHash" FROM vod WHERE "videoSrcHash" = ${cidFixture}`

    expect(rows[0]).to.exist
    expect(rows[0]).to.have.property('videoSrcHash', cidFixture)



  })
})