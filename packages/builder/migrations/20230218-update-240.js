/**
 * read VOD data from markdown files, insert into production db
 */


require('dotenv/config')
const postgres = require('postgres')
const fsp = require('node:fs/promises')
const R = require('ramda');
const marked = require('gray-matter');
const path = require('node:path');
const { add, isAfter, sub } = require('date-fns')
const dateFnsTz = require('date-fns-tz');
const { format, zonedTimeToUtc, utcToZonedTime, toDate } = dateFnsTz;
const fg = require('fast-glob');
const vodDir = '/home/chris/Documents/futureporn-meta/vods.old';
const vodDirPattern = path.join(vodDir, `*.md`);

if (typeof process.env.POSTGRES_HOST === 'undefined') throw new Error('POSTGRES_HOST undef');
if (typeof process.env.POSTGRES_USERNAME === 'undefined') throw new Error('POSTGRES_USERNAME undef');
if (typeof process.env.POSTGRES_PASSWORD === 'undefined') throw new Error('POSTGRES_PASSWORD undef');
if (typeof process.env.FUTUREPORN_WORKDIR === 'undefined') throw new Error('FUTUREPORN_WORKDIR is undefined in env');

const sql = postgres({
  host: process.env.POSTGRES_HOST,
  password: process.env.POSTGRES_PASSWORD,
  user: process.env.POSTGRES_USERNAME,
  database: 'futureporn',
  idle_timeout: 1
})



function getMarkdownFilename () {
  if (R.isEmpty(this.date)) throw new DateMissingError();
  const datestamp = this.getSafeDatestamp();
  return path.join(VOD.dataDir, `${datestamp}.md`);
}

async function loadMarkdown (filename) {
  const rawData = await fsp.readFile(filename, { encoding: 'utf-8' });
  const { data } = marked(rawData);

  // prevent overwriting any existing k/v
  Object.keys(this).forEach((key) => {
    if (
      key !== 'date' && 
      key !== 'twitterThrottleTimer' &&
      key !== 'tags' && 
      this[key] !== ''
    ) throw new Error(`  [d] loadMarkdown detected that this vod already has a key/value ${key}/${this[key]} which means loadMarkdown would overwrite the value. This is unsupported. Please make a VOD instance with only a date, then run loadMarkdown(). (or code new behavior)`)
  });

  this.mergeProperties(data);
}

async function main () {
  let vods = [];

  // create VOD object for each VOD markdown file
  const markdownFiles = await fg([ vodDirPattern ]);
  for (const markdownFile of markdownFiles) {
    const mdRaw = await fsp.readFile(markdownFile);
    const { data } = await marked(mdRaw);
    // console.log(data)
    // const v = new VOD(data);
    // console.log(`VOD found with date:${v.date}`);

    vods.push(data);
  }

  console.log(vods.length)

  // save to db

  for (const vod of vods) {
    console.log(vod)

    if (vod.announceUrl === null) return; 

    await sql`
      UPDATE vod
      SET ${ sql(vod, "video240Hash") }
      WHERE "announceUrl" = ${ vod.announceUrl }
    `

  }

}


main()