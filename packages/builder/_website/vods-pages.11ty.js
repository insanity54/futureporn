
const { format, utcToZonedTime, } = require('date-fns-tz');

function safeDate (text) {
  const date = utcToZonedTime(text, 'UTC');
  const formattedDate = format(date, "yyyyMMdd'T'HHmmss'Z'", { timezone: 'UTC' });
  return formattedDate;
}


class VodsPages {
  // or `async data() {`
  // or `get data() {`
  data() {
    return {
      permalink: function (data) {
        return `/vods/${safeDate(data.vod.attributes.date)}/`;
      },
      // can't do this because eleventy doesnt allow setting tags from eleventyComputed
      // @see https://www.11ty.dev/docs/data-computed/
      // eleventyComputed: {
      //   tags: ['vod'].concat(data.vod.attributes.tags.data.map((d) => d.attributes.name))), // @todo needs to be an iterable. not sure how to do this.
      // },
      tags: ['vod'],
      name: "VodsPages",
      pagination: {
        data: "db.vods",
        size: 1,
        alias: "vod",
        addAllPagesToCollections: true,
      },
      layout: 'layouts/vod.njk'
    };
  }

  render(data) {
    return `<p>${JSON.stringify(data.vod)}</p>`;
  }
}

module.exports = VodsPages;
