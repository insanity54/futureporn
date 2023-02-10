import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import {
    fileURLToPath
} from 'url'
import Fastify from 'fastify'
import fastifyView from '@fastify/view'
import postgres from 'postgres'
import nunjucks from 'nunjucks'
import {loggerFactory} from 'common/logger'


// constants
const logger = loggerFactory({ service: 'futureporn/commander' })
const __dirname = fileURLToPath(path.dirname(
    import.meta.url)); // esm workaround for missing __dirname
const port = process.env.PORT || 1883;
const commanderUsername = process.env.COMMANDER_USERNAME;
const commanderPassword = process.env.COMMANDER_PASSWORD;
const postgresHost = process.env.POSTGRES_HOST;
const postgresUsername = process.env.POSTGRES_USERNAME;
const postgresPassword = process.env.POSTGRES_PASSWORD;



// init
if (typeof commanderUsername === 'undefined') throw new Error('COMMANDER_USERNAME was undefined in env');
if (typeof commanderPassword === 'undefined') throw new Error('COMMANDER_PASSWORD was undefined in env');
if (typeof postgresHost === 'undefined') throw new Error('POSTGRES_HOST undef');
if (typeof postgresUsername === 'undefined') throw new Error('POSTGRES_USERNAME undef');
if (typeof postgresPassword === 'undefined') throw new Error('POSTGRES_PASSWORD undef')
const fastify = Fastify()
const sql = postgres({
    host: postgresHost,
    password: postgresPassword,
    user: postgresUsername
})


let adverts = []
let timer;

function appendAdvert(newAdvert) {
  let duplicate = false;
  for (let i = 0; i < adverts.length; i++) {
    if (adverts[i].workerId === newAdvert.workerId) {
      adverts[i] = newAdvert;
      duplicate = true;
      break;
    }
  }
  if (!duplicate) {
    adverts.push(newAdvert);
  }
}


logger.log({ level: 'debug', message: 'debug is working!' })

sql.listen('capture/vod/advertisement', (data) => {
    logger.log({ level: 'debug', message: `  [*] advert`})
    const d = JSON.parse(data)
    logger.log({ level: 'debug', message: d.streams})
    appendAdvert(d)
})


fastify.register(fastifyView, {
    engine: {
        nunjucks: nunjucks
    },
    root: path.join(__dirname, "views"),
    defaultContext: {
        env: process.env.NODE_ENV
    },
    propertyName: "render",
    maxCache: (process.env.NODE_ENV === 'production') ? 100 : 0,
    options: {
        noCache: (process.env.NODE_ENV === 'production') ? false : true
    }
})



fastify.after(() => {
    fastify.route({
        method: 'GET',
        url: '/command',
        handler: async(req, reply) => {
            console.log({ level: 'debug', message: 'a commander has logged in'})
            return reply.render("command.njk", { 
                mqttPassword,
                mqttUsername
            })
        }
    })

    fastify.route({
        method: 'GET',
        url: '/',
        handler: async(req, reply) => {
            const vods = await sql`SELECT * from vod`
            console.log({ level: 'debug', message: '>>'})
            console.log({ level: 'debug', message: adverts})
            return reply.render("index.njk", { vods, adverts })
        }
    })

    fastify.route({
        method: 'GET',
        url: '/api/scout/stream/stop',
        handler: async(req, reply) => {
            const payload = {
                date: new Date().valueOf()
            }
            await sql.notify('scout/stream/stop', JSON.stringify(payload))
            return 'OK'
        }
    })

    fastify.route({
        method: 'GET',
        url: '/api/capture/vod/upload',
        handler: async(req, reply) => {
            const [{id}] = await sql`SELECT id FROM vod WHERE "captureDate" IS NOT NULL ORDER BY "captureDate" DESC LIMIT 1`
            const payload = {
                date: new Date().valueOf(),
                id
            }
            await sql.notify('capture/vod/upload', JSON.stringify(payload))
            return 'OK'
        }
    })

    fastify.route({
        method: 'GET',
        url: '/health',
        handler: async(req, reply) => {
            reply.send('OK')
        }
    })
})

fastify.listen({
    port
}, (err, address) => {
    if (err) throw err;
    console.log({ level: 'info', message: `Listening on ${address}` })
})