// require('dotenv/config')
// const EleventyFetch = require("@11ty/eleventy-fetch");
// const postgres = require('postgres')
// const { format } = require('date-fns')
// const dateFnsTz = require('date-fns-tz');

// const sql = postgres({
//   username: process.env.POSTGRES_USERNAME,
//   password: process.env.POSTGRES_PASSWORD,
//   host: process.env.POSTGRES_HOST
// })


// module.exports = async function() {
//   const vods = await sql`SELECT * FROM vod`
//   const mappedVods = vods.map((d) => {
//     d.url = `/vods/${format(d.date, "yyyyMMdd'T'HHmmss'Z'", { timezone: 'UTC' })}`
//     console.log(d)
//     return d
//   })
//   return { vods: mappedVods }
// };

let vods = [
  {
    id: 'ec5c7a69-3b11-4cc8-b2e8-8f53bb4c4c1b',
    title: 'i am Mel and Mel is me',
    videoSrc: null,
    videoSrcHash: 'arfaf',
    video720Hash: null,
    video480Hash: null,
    video360Hash: null,
    video240Hash: null,
    thinHash: 'bafkreigq6feyiv27wth74575cutr5gzhigna6gehois2fyw24bzk7nbk4a',
    thiccHash: 'bafkreid2rlwufu3omz647ij3pxiwco2apk7kelppcl767yicv2ipetrx7u',
    announceTitle: 'my dildo is stuck and i cant get up ',
    announceUrl: 'https://twitter.com/projektbutt/status/23894729',
    date: new Date('3023-10-08T00:00:00.000Z'),
    captureDate: null,
    note: null,
    tmpFilePath: null,
    tags: [ 'sex', 'self-care', 'laughing', 'moaning', 'penis' ]
  },
  {
    id: '234908230482039480',
    title: null,
    videoSrc: null,
    videoSrcHash: '333333333333333333333333',
    video720Hash: null,
    video480Hash: null,
    video360Hash: null,
    video240Hash: null,
    thinHash: null,
    thiccHash: null,
    announceTitle: 'ore nore!!!!!!!!!!! ',
    announceUrl: 'https://twitter.com/projektbutt/status/389429',
    date: new Date('3023-10-05T00:00:00.000Z'),
    captureDate: null,
    note: null,
    tmpFilePath: null,
    tags: [ 'fun', 'abstinence', 'penis' ]
  },
  {
    id: 'fb12636e-bc0e-4154-a305-a90bcaa97611',
    title: 'rolo tony brown town',
    videoSrc: null,
    videoSrcHash: 'bafybeid3mg5lzrvnmpfi5ftwhiupp7i5bgkmdo7dnlwrvklbv33telrrry',
    video720Hash: null,
    video480Hash: null,
    video360Hash: null,
    video240Hash: null,
    thinHash: null,
    thiccHash: null,
    announceTitle: 'my dildo is stuck and i cant get up ',
    announceUrl: 'https://twitter.com/projektbutt/status/23894729',
    date: new Date('3023-10-16T00:00:00.000Z'),
    captureDate: new Date('3021-10-16T00:00:00.000Z'),
    note: null,
    tmpFilePath: null,
    tags: [ 'orgasm', '1cum', 'dancing', 'live2d' ]
  }
].sort((a, b) => b.date - a.date)

module.exports = function () {
  return {
    vods: vods
  }
}