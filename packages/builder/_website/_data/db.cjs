require('dotenv/config')

const EleventyFetch = require("@11ty/eleventy-fetch");
const fetch = require('node-fetch')

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
      'populate[0]': 'thumbnail',
      'populate[1]': 'tags',
      'populate[2]': 'videoSrcB2',
    });
    const url = `${process.env.STRAPI_URL}/api/vods?${params}`
    console.log(`url:${url} with key ${process.env.STRAPI_API_KEY}`)
    // const response = await EleventyFetch(url, {
    //   duration: '1s',
    //   type: 'json',
    //   fetchOptions: {
    //     headers: {
    //       'Authorization': `Bearer ${process.env.STRAPI_API_KEY}`
    //     }
    //   }
    // })

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_API_KEY}`
      }
    })
    const response = await res.json()
    console.log(res)
    console.log(response)
    if (requestCounter === 0) {
      totalVodCount = response.meta.pagination.total
      totalRequestsNeeded = Math.ceil(totalVodCount/pageSize)
      console.log(`  >> totalVodCount:${totalVodCount}, totalRequestsNeeded:${totalRequestsNeeded}`)
    }
    vods = vods.concat(response.data)
  }

  // show a sample
  console.log(vods[vods.length-1])
  console.log(vods[0])

  // const sortedVods = vods.sort((a, b) => new Date(a.attributes.date).valueOf() - new Date(b.attributes.date).valueOf() )


  console.log('vods')
  console.log(vods.length)


  return { vods }
};
