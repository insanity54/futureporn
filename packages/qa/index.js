/**

Quality Assurance

  * [ ] serve a webhook
  * [ ] when webhook is hit, do a thing
  * [ ] when doing a thing, GET /api/vods
  * [ ] for each vod, `ipfs pin add` the 
  * [ ] videoSrcHash
  * [ ] video240Hash
  * [ ] thiccHash
  * [ ] post message on Discord channel when task is accomplished

*/


import 'dotenv/config'
import { Client, GatewayIntentBits } from 'discord.js'
import { loggerFactory } from "common/logger"
import Fastify from 'fastify'
import Cluster from 'common/Cluster'
import { ipfsHashRegex } from 'common/constants'
import * as data from './package.json' assert { type: "json" }
const version = data.default.version

if (process.env.DISCORD_CLIENT_ID === undefined) throw new Error('DISCORD_CLIENT_ID undefined in env');
if (process.env.DISCORD_CLIENT_SECRET === undefined) throw new Error('DISCORD_CLIENT_SECRET undefined in env');
if (process.env.DISCORD_BOT_TOKEN === undefined) throw new Error('DISCORD_BOT_TOKEN undefined in env');
if (process.env.DISCORD_CHATOPS_CHANNEL_ID === undefined) throw new Error('DISCORD_CHATOPS_CHANNEL_ID undefined in env');



const logger = loggerFactory({
  service: 'futureporn/qa'
})

const fastify = Fastify({
  logger: false
})

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  logger.log({ level: 'info', message: `Logged in as ${client.user.tag}!` });

  const channel = client.channels.cache.get(process.env.DISCORD_CHATOPS_CHANNEL_ID);
  // channel.send('Hello Worldy!');
});

client.login(process.env.DISCORD_BOT_TOKEN)

// channel.send('Task complete!');



// Run the server!
fastify.listen({ port: process.env.PORT || 5000 }, function (err, address) {
  if (err) {
    logger.log({ level: 'error', message: err })
    process.exit(1)
  }
  logger.log({ level: 'info', message: `QA server ${version} listening on ${address}` })
})

// Declare a webhook route
// This is used by Strapi.
// When a new VOD is created, Strapi GETs the route
// QA responds by adding the IPFS hash
fastify.get('/webhook', async function (request, reply) {
    reply.type('application/json')
    const missing = await checkPins()
    return {
        missing: missing,
        complete: (missing.length === 0),
        message: 'These are the pins listed on the Futureporn API that are currently missing from the IPFS cluster'
    }
})