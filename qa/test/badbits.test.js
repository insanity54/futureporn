/**
 * Identifies Futureporn CIDs that have been "banned"
 * 
 * 
 * ok let's say I have a CID bafybeid3mg5lzrvnmpfi5ftwhiupp7i5bgkmdo7dnlwrvklbv33telrrry. I want to put it in a similar format as the hash I mentioned earlier. How do I do that?
 * 
 * 
 * 
 * 7f3c2dccb6baa5d82dad8d09d98d3d4c5d0a8d83d42ddf733e547f03c1f696ed
 *
 */




import fetch from 'node-fetch'
import { CID } from 'multiformats/cid'
import { sha256 } from 'multiformats/hashes/sha2'
import shajs from 'sha.js'
import { expect } from 'chai'




const pluckCids = (datum) => {
  return [
    datum.videoSrcHash,
    datum.video720Hash,
    datum.video480Hash,
    datum.video360Hash,
    datum.video240Hash,
    datum.thiccHash,
    datum.thinHash
  ]
}




async function getBadBits() {

  let denylist
  try {
    const list = require('./denylist.json')
  } catch (e) {
    const url = 'https://badbits.dwebops.pub/denylist.json'
    const res = await fetch(url)
    const data = await res.json()
    denylist = data
  }

  const hashes = denylist.map((d) => d.anchor).flat()
  return hashes
}


async function getFuturepornCids() {
  const url = 'https://futureporn.net/api/v1.json'
  const res = await fetch(url)
  const data = await res.json()
  const vods = data.vods
  const cids = vods.map(pluckCids)
    .flat()
    .filter((cid) => cid !== "")
    .map((cid) => cid.split(/[?#]/)[0])
    .map((cid) => shajs('sha256').update(cid).digest('hex'))
  return cids
}



describe('badbits', function() {
  it('should not have any CIDs in badbits list', async function() {
    this.timeout(1000*45)

    console.log('  [*] downloading badbits')
    const bad = await getBadBits()

    console.log('  [*] downloading futureporn CIDs')
    const good = await getFuturepornCids()



    console.log(`  [*] there are ${bad.length} bad bits. sample: ${bad[0]}`)
    console.log(`  [*] there are ${good.length} futureporn CIDs. sample: ${good[0]}`)



    expect(bad).to.not.include(good, 'Futureporn CID found within badbits!')

  })
})
