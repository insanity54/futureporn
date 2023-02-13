require('dotenv/config')
const queueFactory = require('fastq')
const postgres = require('postgres')
const Eleventy = require('@11ty/eleventy');

if (typeof process.env.POSTGRES_HOST === 'undefined') throw new Error('POSTGRES_HOST undef');
if (typeof process.env.POSTGRES_USERNAME === 'undefined') throw new Error('POSTGRES_USERNAME undef');
if (typeof process.env.POSTGRES_PASSWORD === 'undefined') throw new Error('POSTGRES_PASSWORD undef');
if (typeof process.env.FUTUREPORN_WORKDIR === 'undefined') throw new Error('FUTUREPORN_WORKDIR is undefined in env');
// if (typeof process.env.GITHUB_DEPLOY_KEY === 'undefined') throw new Error('GITHUB_DEPLOY_KEY is undefined in env');

let logger

async function setupLogger () {
  const { loggerFactory } = await import('common/logger')
  logger = loggerFactory({
    service: 'futureporn/builder'
  })
}


const buildQueue = queueFactory.promise(worker, 1)
const sql = postgres({
  host: process.env.POSTGRES_HOST,
  password: process.env.POSTGRES_PASSWORD,
  user: process.env.POSTGRES_USERNAME,
  database: 'futureporn'
})



async function worker (id) {
  
  logger.log({ level: 'info', message: ` worker got invoked! id:${id}` })

  // // query db for capture data
  // const captureData = await sql`
  //   SELECT *
  //   FROM vod
  //   WHERE id = ${id};
  // `
  // logger.log('here is capture data')
  // logger.log(captureData)


  // // query db for scout data
  // // we get the most recent row with twitter data
  // const scoutData = await sql`
  //   SELECT * 
  //   FROM vod 
  //   WHERE "announceUrl" IS NOT NULL
  //     AND "date" IS NOT NULL
  //     AND "videoSrcHash" IS NULL
  //   ORDER BY "date" DESC 
  //   LIMIT 1;
  // `
  // logger.log(`here is scout data. announceUrl:${scoutData[0].announceUrl}, announceTitle:${scoutData[0].announceTitle}, date:${scoutData[0].date}`)
  // logger.log(scoutData)



  // try {
  //   // update the capture data using tweet data from scout
  //   const merge = await sql`
  //     UPDATE vod
  //     SET
  //       "announceUrl" = ${scoutData[0].announceUrl},
  //       "announceTitle" = ${scoutData[0].announceTitle},
  //       "date" = ${scoutData[0].date}
  //     WHERE vod.id = ${id}
  //   `



  // // // tweet data from scout
  // // const merge = await sql`
  // //   WITH most_recent AS (
  // //     SELECT "announceUrl", "announceTitle", "date"
  // //     FROM vod
  // //     WHERE "announceUrl" IS NOT NULL
  // //       AND "date" IS NOT NULL
  // //     ORDER BY "date" DESC
  // //     LIMIT 1
  // //   )
  // //   UPDATE vod
  // //   SET "announceUrl" = most_recent."announceUrl",
  // //       "announceTitle" = most_recent."announceTitle",
  // //       "date" = most_recent.date
  // //   FROM most_recent
  // //   WHERE vod.id = ${id};
  // // `


  // logger.log('here is the merge data')
  // logger.log(merge)

  // logger.log(`  let us delete ${scoutData[0].id}`)

  // // delete the most_recent_tweet row
  // const del = await sql`
  //   DELETE FROM vod
  //   WHERE vod.id = ${scoutData[0].id}
//   // `
//   logger.log(del)

//   logger.log('query complete')
// } catch (e) {
//   logger.log({ level: 'error', message: 'error while merging' })
//   logger.log({ level: 'error', message: 'e' })
// }

  await buildSite()

  // git pull
  // create md file
  // git commit
  // git push


}



async function buildSite() {
  logger.log({ level: 'info', message: 'Building the site' })
  let options = {
    configPath: './.eleventy.cjs'
  }
  let elev = new Eleventy('./website', './_site', options);

  try {
    await elev.write();
  } catch (e) {
    logger.log({ level: 'error', message: e })
  }

  logger.log({ level: 'info', message: '11ty build successful' })

}


async function main() {
  await setupLogger()
  logger.log({ level: 'info', message: 'it works'})

  sql.listen('futureporn', async (data) => {
    logger.log({ level: 'info', message: `received notification on futureporn channel` })

    const { id, date, topic } = JSON.parse(data)

    if (topic === 'capture/vod/upload') {
      logger.log({ level: 'info', message: `futureporn/capture said it just uploaded vod ${id}` })
      await buildQueue.push(id)
      logger.log({ level: 'info', message: `build process complete.` })
    }
  })
}



main()
