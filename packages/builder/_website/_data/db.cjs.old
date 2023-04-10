require('dotenv/config')
// const EleventyFetch = require("@11ty/eleventy-fetch");
const postgres = require('postgres')
const { format } = require('date-fns')
const dateFnsTz = require('date-fns-tz');

const sql = postgres({
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  idle_timeout: 1
})


module.exports = async function() {
  const vods = await sql`SELECT * FROM vod ORDER BY date ASC;`
  return { vods }
};
