

import twitter from './src/twitter.js'
import chaturbateEmitter from './src/chaturbate.js'
import debugFactory from 'debug'
const debug = debugFactory('futureporn-scout')





const dataConsumer = (tweet) => {
	debug(`  [*] Tweet: ${JSON.stringify(tweet, 0, 2)}`)
}


async function main () {
	twitter(dataConsumer)
}

main()



