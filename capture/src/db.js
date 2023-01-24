

import 'dotenv/config'
import cuid from 'cuid'

const workerId = cuid();


export default function dbFactory (sql) {

  const notify = async function notify (topic, data) {
    const res = await sql.notify(topic, Object.assign({ 
      timestamp: new Date().valueOf(),
      sender: workerId
    }, data))
    return res
  }

  const saveVod = async function saveVod (vod) {
    await sql`insert into vods ( videoSrcHash, lastUpdatedAt ) values (${vod.file}, ${vod.timestamp}) returning *`
  }

  return {
    notify,
    saveVod
  }

}


