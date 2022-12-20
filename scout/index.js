
import debugFactory from 'debug'
const debug = debugFactory('scout/index')

import twitter from './src/twitter.js'
import chaturbateEmitter from './src/chaturbate.js'
import { containsCBInviteLink } from "./src/tweetProcess.js";
import aedes from './src/aedes.js'





const tweetConsumer = (tweet) => {
	debug(`  [*] Tweet: ${JSON.stringify(tweet, 0, 2)}`)

	if (containsCBInviteLink(tweet)) {
		debug(`  [*] The tweet contains a CB invite link.`)
		aedes.publish('futureporn/scout/tweet', tweet)
	}
}


async function main () {
	twitter(tweetConsumer)
}

main()



