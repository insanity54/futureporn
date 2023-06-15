
const { format, utcToZonedTime, } = require('date-fns-tz');

function safeDate (text) {
  const date = utcToZonedTime(text, 'UTC');
  const formattedDate = format(date, "yyyyMMdd'T'HHmmss'Z'", { timezone: 'UTC' });
  return formattedDate;
}

module.exports = {
  data: {
    permalink: function (data) {
      return `/vods/${safeDate(data.vod.attributes.date)}/`;
    },
    layout: 'layouts/vod.njk',
    pagination: {
      data: 'db.vods',
      size: 1,
      alias: 'vod'
    }
  },
  render: data => `<p>${JSON.stringify(data.vod)}</p>`
};