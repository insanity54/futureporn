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
  const vods = await fetchPaginatedData('/api/vods', 100, { 
    'populate[0]': 'muxAsset', 
    'populate[1]': 'thumbnail',
    'populate[2]': 'tagVodRelations',
    'populate[tagVodRelations][populate][0]': 'tag',
    'sort[0]': 'date',
  });
  const tagVodRelations = await fetchPaginatedData('/api/tag-vod-relations', 100, { 'populate[0]': 'tag', 'populate[1]': 'vod' });
  const toys = await fetchPaginatedData('/api/toys', 100, { 'populate': '*' });
  const tags = Array.from(
    new Set(tagVodRelations.map((tvr) => tvr.attributes.tag.data.attributes.name))
  ).map((tagName) => {
    return tagVodRelations.find((tvr) => tvr.attributes.tag.data.attributes.name === tagName);
  }).map((tvr) => tvr.attributes.tag.data.attributes.name);

  console.log('here are vods')
  console.log(vods[0])


  //   {
  //   id: 175,
  //   attributes: {
  //     votes: null,
  //     createdAt: '2023-06-09T22:45:42.499Z',
  //     updatedAt: '2023-06-09T22:45:42.499Z',
  //     creatorId: 1,
  //     tag: [Object],
  //     vod: [Object]
  //   }
  // },


  console.log('here are the tags (sample)')
  console.log(JSON.stringify(tags[0], 0, 2))

  // cache vod poster images and monkeypatch the vods object with the local cacheUrl
  for (const vod of vods) {
    if (vod?.attributes?.thumbnail?.data) {
      const stats = await Image(vod.attributes.thumbnail.data.attributes.url, {
        widths: ['auto'],
        outputDir: '_site/img',
        cacheOptions: {
          duration: '*'
        }
      })
      vod.attributes.thumbnail.data.attributes.cacheUrl = stats.webp[0].url
    }
  }



  return { vods, tagVodRelations, tags, toys };
};