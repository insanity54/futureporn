require('dotenv/config');

const EleventyFetch = require("@11ty/eleventy-fetch");
const { sub, format } = require('date-fns');
const dateFnsTz = require('date-fns-tz');

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
      duration: '1h',
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
  const vods = await fetchPaginatedData('/api/vods', 100, { 'populate[0]': 'tags' });
  const tags = await fetchPaginatedData('/api/tags', 100);
  const toys = await fetchPaginatedData('/api/toys', 100, { 'populate': '*' });


  return { vods, tags, toys };
};