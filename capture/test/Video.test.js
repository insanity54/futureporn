
import 'dotenv/config'
import Video from '../src/Video.js'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import chai, { expect } from 'chai'

chai.use(sinonChai);

const __dirname = dirname(fileURLToPath(import.meta.url));



const dataFixture = [
  {
      timestamp: 1,
      file: 'mock-stream0.mp4'
  }, {
      timestamp: 2,
      file: 'mock-stream1.mp4'
  }, {
      timestamp: 3,
      file: 'mock-stream2.mp4'
  }
]

describe('Video', function () {

  let video

  before(() => {
    // copy files to /tmp so we dont clutter the fixtures dir
    // and simulate cwd being process.env.FUTUREPORN_TMP
    dataFixture.forEach((d) => {
      fs.copyFileSync(
        path.join(__dirname, 'fixtures', d.file), 
        path.join(os.tmpdir(), d.file)
      )
    })
  })



  beforeEach(() => {
    video = new Video({
      cwd: os.tmpdir(),
      filePaths: dataFixture,
      execa: sinon.fake.resolves({ exitCode: 0, killed: false, stdout: "i am so horni rn", stderr: null })
    })
  })

  afterEach(function() {
      sinon.restore();
  })


  describe('getFilesTxt', function () {
    it('should generate contents suitable for input to `ffmpeg -f concat`', function () {
      const txt = video.getFilesTxt()
      expect(txt).to.deep.equal("file 'mock-stream0.mp4'\nfile 'mock-stream1.mp4'\nfile 'mock-stream2.mp4'\n")
    })
  })

  describe('concat', function () {
    it('should join multiple videos into one', async function () {
      const file = await video.concat()
      expect(typeof file === 'string').to.be.true
      expect(video.execa).calledOnce
      expect(file).to.match(/\.mp4$/)
    })
  })

  describe('getFilesFile', function () {
    it('should create a files.txt and return the path', async function () {
      const file = await video.getFilesFile()
      expect(typeof file === 'string').to.be.true
      expect(file).to.equal(path.join(os.tmpdir(), 'files.txt'))
    })
  })
})