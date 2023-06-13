require('dotenv/config');

const EleventyFetch = require("@11ty/eleventy-fetch");
const { sub, format } = require('date-fns');
const dateFnsTz = require('date-fns-tz');
const Image = require("@11ty/eleventy-img");

async function fetchPaginatedData(apiEndpoint, pageSize, queryParams = {}) {
  let data = [];
  let totalDataCount = null;
  let totalRequestsNeeded = 1;

  for (let requestCounter = 0; requestCounter < totalRequestsNeeded; requestCounter++) {
    const humanReadableRequestCount = requestCounter + 1;
    console.log(`>> request ${humanReadableRequestCount} of ${totalRequestsNeeded + 1}`);
    const params = new URLSearchParams({
      'pagination[page]': humanReadableRequestCount,
      'pagination[pageSize]': pageSize,
      ...queryParams,
    });
    const url = `${process.env.STRAPI_URL}${apiEndpoint}?${params}`;
    console.log(`url:${url} with key ${process.env.STRAPI_API_KEY}`);
    const response = await EleventyFetch(url, {
      duration: '5m',
      type: 'json',
      fetchOptions: {
        headers: {
          'Authorization': `Bearer ${process.env.STRAPI_API_KEY}`,
        },
      },
    });

    if (requestCounter === 0) {
      totalDataCount = response.meta.pagination.total;
      totalRequestsNeeded = Math.ceil(totalDataCount / pageSize);
      console.log(`  >> totalDataCount:${totalDataCount}, totalRequestsNeeded:${totalRequestsNeeded}`);
    }
    data = data.concat(response.data);
  }

  return data;
}


module.exports = async function () {
  const vods = await fetchPaginatedData('/api/vods', 100, { 'populate[0]': 'tags', 'populate[1]': 'muxAsset', 'populate[2]': 'thumbnail', 'sort[0]': 'date' });
  const tags = await fetchPaginatedData('/api/tags', 100);
  const toys = await fetchPaginatedData('/api/toys', 100, { 'populate': '*' });


  // cache vod poster images and monkeypatch the vods object with the local cacheUrl
  for (const vod of vods) {
    if (vod?.attributes?.thumbnail?.data) {
      const stats = await Image(vod.attributes.thumbnail.data.attributes.url, {
        widths: ['auto'],
        cacheOptions: {
          duration: '*'
        }
      })
      console.log(`${vod.attributes.thumbnail.data.attributes.url} becomes ${stats.webp[0].url}`)
      console.log(stats)
      vod.attributes.thumbnail.data.attributes.cacheUrl = stats.webp[0].url
    }
  }

  console.log(vods[0].attributes.thumbnail.data)
  console.log(vods.at(-1).attributes.thumbnail.data)


  return { vods, tags, toys };
};