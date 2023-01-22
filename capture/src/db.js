

import 'dotenv/config'
import postgres from 'postgres'
import cuid from 'cuid'

if (typeof process.env.POSTGRES_HOST === 'undefined') throw new Error('POSTGRES_HOST undef');
if (typeof process.env.POSTGRES_USERNAME === 'undefined') throw new Error('POSTGRES_USERNAME undef');
if (typeof process.env.POSTGRES_PASSWORD === 'undefined') throw new Error('POSTGRES_PASSWORD undef');
if (typeof process.env.FUTUREPORN_WORKDIR === 'undefined') throw new Error('FUTUREPORN_WORKDIR is undefined in env');


const sql = postgres({
    host: process.env.POSTGRES_HOST,
    password: process.env.POSTGRES_PASSWORD,
    userName: process.env.POSTGRES_USERNAME
})

const workerId = cuid();


export async function notify (topic, data) {
  await sql.notify(topic, Object.assign({ 
    timestamp: new Date().valueOf(),
    sender: workerId
  }, data))
}

export async function saveVod (vod) {
  await sql`insert into vods ( videoSrcHash, lastUpdatedAt ) values (${vod.file}, ${vod.timestamp}) returning *`
}