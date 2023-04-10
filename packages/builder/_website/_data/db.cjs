require('dotenv/config')

const EleventyFetch = require("@11ty/eleventy-fetch");

const { sub, format } = require('date-fns')
const dateFnsTz = require('date-fns-tz');



module.exports = async function() {

  let vods = []
  let totalVodCount = null
  let totalRequestsNeeded = 1 // at least 1 needed. this gets updated after first request
  let pageSize = 100

  for (let requestCounter = 0; requestCounter < totalRequestsNeeded; requestCounter++) {
    const humanReadableRequestCount = requestCounter+1
    console.log(`>> request ${humanReadableRequestCount} of ${totalRequestsNeeded+1}`)
    const response = await EleventyFetch(`https://portal.futureporn.net/api/vods?sort[0]=date&pagination[page]=${humanReadableRequestCount}&pagination[pageSize]=${pageSize}`, {
      duration: '1m',
      type: 'json'
    })
    if (requestCounter === 0) {
      totalVodCount = response.meta.pagination.total
      totalRequestsNeeded = Math.ceil(totalVodCount/pageSize)
      console.log(`  >> totalVodCount:${totalVodCount}, totalRequestsNeeded:${totalRequestsNeeded}`)
    }
    vods = vods.concat(response.data)
  }


  console.log(vods)

  // const sortedVods = vods.sort((a, b) => new Date(a.attributes.date).valueOf() - new Date(b.attributes.date).valueOf() )


  console.log('vods')
  console.log(vods.length)


  return { vods }
};
