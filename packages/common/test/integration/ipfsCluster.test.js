import Cluster from '../../src/Cluster.js'
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { expect } from 'chai';
import dotenv from 'dotenv'
dotenv.config()
const __dirname = dirname(fileURLToPath(import.meta.url));


const screenshotFixtureCid = 'bafybeidr7sbjslkexppjfos2irsyghgvghjgvhf5fessetmha7dt4pcjmu'
const screenshotFixturePath = path.join(__dirname, '..', 'fixtures', 'screenshot.png')

describe('Cluster', function () {
  describe('add', function () {
    it('should upload a file', async function () {
      this.timeout(1000*30)
      const cluster = new Cluster({
        username: process.env.IPFS_CLUSTER_HTTP_API_USERNAME,
        password: process.env.IPFS_CLUSTER_HTTP_API_PASSWORD,
        uri: 'https://sbtp.xyz:9094'
      })
      const res = await cluster.add(screenshotFixturePath)
      expect(res).to.have.property('cid', screenshotFixtureCid)
    })
    it('should upload a bigger file', async function () {
      this.timeout(1000*60*3)
      const cluster = new Cluster({
        username: process.env.IPFS_CLUSTER_HTTP_API_USERNAME,
        password: process.env.IPFS_CLUSTER_HTTP_API_PASSWORD,
        uri: 'https://sbtp.xyz:9094'
      })
      const res = await cluster.add('/home/chris/Documents/projektmelody/Projekt Melody _ VSHOJO - A.I.s save so much money on closet space-1596526711801319427.mp4')
      expect(res).to.have.property('cid')
    })
  })
})