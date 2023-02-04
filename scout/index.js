

import twitter from './src/twitter.js'
import { chat, getViewerCount, monitorRealtimeStatus } from './src/chaturbate.js'
import { containsCBInviteLink } from "./src/tweetProcess.js"
import logger from './src/logger.js'
import postgres from 'postgres'

if (typeof process.env.POSTGRES_HOST === 'undefined') throw new Error('POSTGRES_HOST undef');
if (typeof process.env.POSTGRES_USERNAME === 'undefined') throw new Error('POSTGRES_USERNAME undef');
if (typeof process.env.POSTGRES_PASSWORD === 'undefined') throw new Error('POSTGRES_PASSWORD undef');


const sql = postgres({
  user: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST
})


/**
 * tweetConsumer
 * 
 * this is the function that is called when a tweet is detected
 */
const tweetConsumer = (tweet) => {
	logger.log({ level: 'debug', message: `  [*] Tweet: ${JSON.stringify(tweet, 0, 2)}` })

	if (containsCBInviteLink(tweet)) {
		logger.log({ level: 'debug', message: `  [*] The tweet contains a CB invite link.` })
		aedes.publish('futureporn/scout/tweet', tweet)
	}
}


const onCbStart = () => {
  sql.notify('scout/stream/start', { date: new Date().valueOf() })
}


const onCbStop = () => {
  sql.notify('scout/stream/stop', { date: new Date().valueOf() })
}


/**
 * main
 * 
 *   - connect to twitter and listen for new tweets
 *   - connect to chaturbate chat and watch for spikes in messages per minute 
 */
async function main () {
	// twitter(tweetConsumer)
  await monitorRealtimeStatus('projektmelody', onCbStart, onCbStop)
}

logger.log({ level: 'info', message: 'hello' })
logger.log({ level: 'info', message: `process.env.NODE_ENV:${process.env.NODE_ENV}` })

main()



