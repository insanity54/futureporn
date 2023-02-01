
import Ipfs from '../src/Ipfs.js'
import { expect } from 'chai'
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const ipfsExecutable = '/home/chris/.local/bin/ipfs'

describe('Ipfs', function() {
  describe('hash', function () {
    it('should hash a file and return the v1 CID', async function () {
      const ipfs = new Ipfs({ ipfsExecutable })
      const cid = await ipfs.hash(path.join(__dirname, '../test/fixtures/mock-stream0.mp4'))
      expect(cid).to.equal('bafkreihfbftehabfrakhr6tmbx72inewwpayw6cypwgm6lbhbf7mxm7wni')
    })
  })
})