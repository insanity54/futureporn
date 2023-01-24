
import 'dotenv/config'
import { concat, getFilesTxt, getFilesFile } from '../src/video.js'
import { expect } from 'chai'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'node:path'

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

describe('video', function () {
  describe('concat', function () {
    it('should combine several videos into one', async function() {
      const cwd = path.join(__dirname, './fixtures')
      const outputFile = await concat(dataFixture, {
        cwd
      })
    })
  })
})