
import debugFactory from 'debug'
const debug = debugFactory('scout/index')

import twitter from './src/twitter.js'
import { chat, getViewerCount } from './src/chaturbate.js'
import { containsCBInviteLink } from "./src/tweetProcess.js";
import aedes from './src/aedes.js'




/**
 * tweetConsumer
 * 
 * this is the function that is called when a tweet is detected
 */
const tweetConsumer = (tweet) => {
	debug(`  [*] Tweet: ${JSON.stringify(tweet, 0, 2)}`)

	if (containsCBInviteLink(tweet)) {
		debug(`  [*] The tweet contains a CB invite link.`)
		aedes.publish('futureporn/scout/tweet', tweet)
	}
}



/**
 * main
 * 
 *   - connect to twitter and listen for new tweets
 *   - connect to chaturbate chat and watch for spikes in messages per minute 
 */
async function main () {
	twitter(tweetConsumer)

}

main()



