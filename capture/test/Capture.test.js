
import Video from '../src/Video.js'
import { expect } from 'chai'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('Capture', function () {
  xdescribe('upload', function () {
    it('', function () {
      const txt = getFilesTxt(dataFixture)
      expect(txt).to.deep.equal("file 'mock-stream0.mp4'\nfile 'mock-stream1.mp4'\nfile 'mock-stream2.mp4'\n")
    })
  })
  xdescribe('save', function () {
    it('should save to db')
  })
})