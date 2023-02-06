import 'dotenv/config'
import queueFactory from 'fastq'
import postgres from 'postgres'
import debugFactory from 'debug'


if (typeof process.env.POSTGRES_HOST === 'undefined') throw new Error('POSTGRES_HOST undef');
if (typeof process.env.POSTGRES_USERNAME === 'undefined') throw new Error('POSTGRES_USERNAME undef');
if (typeof process.env.POSTGRES_PASSWORD === 'undefined') throw new Error('POSTGRES_PASSWORD undef');
if (typeof process.env.FUTUREPORN_WORKDIR === 'undefined') throw new Error('FUTUREPORN_WORKDIR is undefined in env');
// if (typeof process.env.GITHUB_DEPLOY_KEY === 'undefined') throw new Error('GITHUB_DEPLOY_KEY is undefined in env');

const debug = debugFactory('futureporn/builder')



const queue = queueFactory.promise(worker, 1)
const sql = postgres({
  host: process.env.POSTGRES_HOST,
  password: process.env.POSTGRES_PASSWORD,
  user: process.env.POSTGRES_USERNAME,
  database: 'futureporn'
})


async function worker (id) {
  
  debug('  [*] worker got invoked!')
  debug(id)

  // query db for capture data
  const captureData = await sql`
    SELECT *
    FROM vod
    WHERE id = ${id};
  `
  debug('here is capture data')
  debug(captureData)


  // query db for scout data
  // we get the most recent row with twitter data
  const scoutData = await sql`
    SELECT * 
    FROM vod 
    WHERE "announceUrl" IS NOT NULL
      AND "date" IS NOT NULL
      AND "videoSrcHash" IS NULL
    ORDER BY "date" DESC 
    LIMIT 1;
  `
  debug(`here is scout data. announceUrl:${scoutData[0].announceUrl}, announceTitle:${scoutData[0].announceTitle}, date:${scoutData[0].date}`)
  debug(scoutData)



  try {
    // update the capture data using tweet data from scout
    const merge = await sql`
      UPDATE vod
      SET
        "announceUrl" = ${scoutData[0].announceUrl},
        "announceTitle" = ${scoutData[0].announceTitle},
        "date" = ${scoutData[0].date}
      WHERE vod.id = ${id}
    `



  // // tweet data from scout
  // const merge = await sql`
  //   WITH most_recent AS (
  //     SELECT "announceUrl", "announceTitle", "date"
  //     FROM vod
  //     WHERE "announceUrl" IS NOT NULL
  //       AND "date" IS NOT NULL
  //     ORDER BY "date" DESC
  //     LIMIT 1
  //   )
  //   UPDATE vod
  //   SET "announceUrl" = most_recent."announceUrl",
  //       "announceTitle" = most_recent."announceTitle",
  //       "date" = most_recent.date
  //   FROM most_recent
  //   WHERE vod.id = ${id};
  // `


  debug('here is the merge data')
  debug(merge)

  debug(`  let us delete ${scoutData[0].id}`)

  // delete the most_recent_tweet row
  const del = await sql`
    DELETE FROM vod
    WHERE vod.id = ${scoutData[0].id}
  `
  debug(del)

  debug('query complete')
} catch (e) {
  console.error('error while merging')
  console.error(e)
}


  // git pull
  // create md file
  // git commit
  // git push
}



function main() {

  sql.listen('capture/vod/upload', async (data) => {
    const { id, date } = JSON.parse(data)
    debug(`  [*] Capture said it just uploaded vod ${id}`)
    queue.push(id)
  })

  

}



main()
