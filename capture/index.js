#!/usr/bin/env node

import "dotenv/config"
import Voddo from './src/voddo.js'
import debugFactory from 'debug'
import postgres from 'postgres'
import cuid from 'cuid'

const debug = debugFactory('futureporn/capture/index')
const postgresUsername = process.env.POSTGRES_USERNAME;
const postgresPassword = process.env.POSTGRES_PASSWORD;
const postgresHost = process.env.POSTGRES_HOST;
const idleTimeoutMinutes = 15
const workerId = cuid();

if (typeof postgresHost === 'undefined') throw new Error('POSTGRES_HOST undef');
if (typeof postgresUsername === 'undefined') throw new Error('POSTGRES_USERNAME undef');
if (typeof postgresPassword === 'undefined') throw new Error('POSTGRES_PASSWORD undef');
if (typeof process.env.FUTUREPORN_WORKDIR === 'undefined') throw new Error('FUTUREPORN_WORKDIR is undefined in env');



let files = []



let actionTimer;
(async function main () {



	const voddo = new Voddo({
		url: 'https://chaturbate.com/projektmelody',
		format: 'best',
		cwd: process.env.FUTUREPORN_WORKDIR
	})


	const sql = postgres({
	    host: postgresHost,
	    password: postgresPassword,
	    userName: postgresUsername
	})


	voddo.on('start', (data) => {

		console.log('  [*] we are starting')
		console.log(data)



		// clearTimeout(actionTimer);
		// actionTimer = setTimeout(() => {
		// 	console.log(`  [*] no new file names have been emitted for ${idleTimeoutMinutes} minutes.`)
		// 	saveMetadata()
		// }, 1000*60*idleTimeoutMinutes)

		// saveMetadata(metadata)
		// pub.publish('futureporn/capture/file', JSON.stringify(file))
	})

	voddo.on('stop', (data) => {

		console.log('  [*] we have stopped')
		console.log(data)
		// saveMetadata()
	})

	// voddo.delayedStart() // only for testing
	voddo.start()

})()









// @TODO

// // voddo generates a report when it's done recording a stream
// voddo.on('report', (report) => {
// 	pub.publish('futureporn/capture/report', JSON.stringify(report));
// })

// voddo.on('file', (file) => {
// 	pub.publish('futureporn/capture/file', JSON.stringify(file))
// })

// sub.on('connect', (channel) => {
// 	debug(`  [*] Redis subscription connected to channel ${channel}`)
// })

// sub.on('message', (channel, message) => {
// 	debug(`  [*] got message. channel:${channel}, message:${JSON.stringify(message)}`)
// 	if (channel === 'futureporn/scout') {
// 		debug(`  [*] Starting voddo`)
// 		voddo.start()
// 	}
// })

// sub.subscribe('futureporn/scout', () => {
// 	pub.publish('futureporn/capture', { message: `${workerId} listening}` })
// })

