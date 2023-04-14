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
    const params = new URLSearchParams({ 
      'sort[0]': 'date',
      'pagination[page]': humanReadableRequestCount,
      'pagination[pageSize]': pageSize,
      'populate[0]': 'mux_video_uploader_mux_asset'
    });
    const url = `https://portal.futureporn.net/api/vods?${params}`
    // const `https://portal.futureporn.net/api/vods?sort[0]=date&pagination[page]=${humanReadableRequestCount}&pagination[pageSize]=${pageSize}`
    console.log(`url:${url}`)
    const response = await EleventyFetch(url, {
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


  console.log(vods.find(v => v.id === 125).attributes.mux_video_uploader_mux_asset.data)

  // const sortedVods = vods.sort((a, b) => new Date(a.attributes.date).valueOf() - new Date(b.attributes.date).valueOf() )


  console.log('vods')
  console.log(vods.length)


  return { vods }
};
