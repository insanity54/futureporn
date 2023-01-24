import * as dotenv from 'dotenv'
dotenv.config()
import fs from 'node:fs'
import path from 'node:path'
import {
    fileURLToPath
} from 'url'
import Aedes from "aedes"
import Fastify from 'fastify'
import fastifyBasicAuth from '@fastify/basic-auth'
import fastifyAuth from '@fastify/auth'
import fastifyView from '@fastify/view'
import postgres from 'postgres'
// import fastifyLeveldb from '@fastify/leveldb'
import nunjucks from 'nunjucks'
// import Redis from 'ioredis';
// import fastifyRedis from '@fastify/redis'
// import { createClient } from 'redis'


// constants
const __dirname = fileURLToPath(path.dirname(
    import.meta.url)); // esm workaround for missing __dirname
const port = process.env.PORT || 1883;
const commanderUsername = process.env.COMMANDER_USERNAME;
const commanderPassword = process.env.COMMANDER_PASSWORD;
const mqttPassword = process.env.MQTT_PASSWORD;
const mqttUsername = process.env.MQTT_USERNAME;
const postgresHost = process.env.POSTGRES_HOST;
const postgresUsername = process.env.POSTGRES_USERNAME;
const postgresPassword = process.env.POSTGRES_PASSWORD;

const authenticate = {
    realm: 'commander'
}


// init
if (typeof commanderUsername === 'undefined') throw new Error('COMMANDER_USERNAME was undefined in env');
if (typeof commanderPassword === 'undefined') throw new Error('COMMANDER_PASSWORD was undefined in env');
// if (typeof mqttPassword === 'undefined') throw new Error('MQTT_PASSWORD was undefined in env');
// if (typeof mqttUsername === 'undefined') throw new Error('MQTT_USERNAME was undefined in env');
if (typeof postgresHost === 'undefined') throw new Error('POSTGRES_HOST undef');
if (typeof postgresUsername === 'undefined') throw new Error('POSTGRES_USERNAME undef');
if (typeof postgresPassword === 'undefined') throw new Error('POSTGRES_PASSWORD undef')
const fastify = Fastify()
const sql = postgres({
    host: postgresHost,
    password: postgresPassword,
    userName: postgresUsername
})
// const redis = createClient({
//     url: `redis://${redisUsername}:${redisPassword}@commander.sbtp.xyz:6379`,
//     namespace: 'futureporn'
// });
// const redis = new Redis({
//     port: 6379,
//     host: redisHost,
//     username: redisUsername,
//     password: redisPassword
// })


// redis.on("message", (channel, message) => {
//   console.log(`Received ${message} from ${channel}`);
// });

// // const subscriber = redis.duplicate()
// redis.subscribe("futureporn/capture", (err, count) => {
//   if (err) {
//     // Just like other commands, subscribe() can fail for some reasons,
//     // ex network issues.
//     console.error("Failed to subscribe: %s", err.message);
//   } else {
//     // `count` represents the number of channels this client are currently subscribed to.
//     console.log(
//       `Subscribed successfully! This client is currently subscribed to ${count} channels.`
//     );
//   }
// });






fastify.register(fastifyAuth)
fastify.register(fastifyBasicAuth, {
    validate,
    authenticate
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
// fastify.register(fastifyRedis, { client: redis })
// fastify.register(fastifyLeveldb, {
//     name: 'messages'
// })


async function validate(username, password, req, reply) {
    if (username !== commanderUsername || password !== commanderPassword) {
        return new Error('Wrong creds.')
    }
    console.log(`  [*] authed user ${req.ip}`)
}

fastify.after(() => {
    fastify.addHook('preHandler', fastify.auth([fastify.basicAuth]))
    fastify.route({
        method: 'GET',
        url: '/command',
        handler: async(req, reply) => {
            console.log('a commander has logged in')
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
            return reply.render("index.njk")
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
    console.log(`Listening on ${address}`)
})