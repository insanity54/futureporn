#!/usr/bin/env node

import "dotenv/config"
import Voddo from './src/voddo.js'
import debugFactory from 'debug'
import dbFactory from './src/db.js'

import postgres from 'postgres'
if (typeof process.env.POSTGRES_HOST === 'undefined') throw new Error('POSTGRES_HOST undef');
if (typeof process.env.POSTGRES_USERNAME === 'undefined') throw new Error('POSTGRES_USERNAME undef');
if (typeof process.env.POSTGRES_PASSWORD === 'undefined') throw new Error('POSTGRES_PASSWORD undef');
if (typeof process.env.FUTUREPORN_WORKDIR === 'undefined') throw new Error('FUTUREPORN_WORKDIR is undefined in env');


const sql = postgres({
    host: process.env.POSTGRES_HOST,
    password: process.env.POSTGRES_PASSWORD,
    username: process.env.POSTGRES_USERNAME,
    database: 'futureporn'
})

const db = dbFactory(sql)


const debug = debugFactory('futureporn/capture/index')

const idleTimeoutMinutes = 15

if (typeof process.env.FUTUREPORN_WORKDIR === 'undefined') throw new Error('FUTUREPORN_WORKDIR is undefined in env');






let actionTimer;
(async function main () {


	const res = await db.notify('futureporn/capture', {message: 'idk!??!?!?'})
	console.log(res)

	const voddo = new Voddo({
		url: 'https://chaturbate.com/projektmelody',
		format: 'best',
		cwd: process.env.FUTUREPORN_WORKDIR
	})


	/**
	 * When scout signals that a stream has ended, 
	 * we cancel any ongoing actionTimer and immediately process the VOD
	 * 
	 * @todo standardize the LISTEN/NOTIFY spec
	 */
	// sql.on('futureporn/scout/end', (evt) => {

	// 	clearTimeout(actionTimer)
	// })


	voddo.on('start', (data) => {
		// pub.publish('futureporn/capture/file', JSON.stringify(file)) // @todo
		console.log(data)
	})

	voddo.on('stop', (report) => {

		console.log('  [*] we have stopped')
		console.log(report)

		// saveMetadata(report) // do we need this?

		// @todo detect stream end (scout signal?)

		if (report.reason !== 'close') {
			console.warn('Voddo stopped irregularly.')
			console.warn(report.reason)
		} else {
			// process/upload if stream has been stopped for 15 minutes
			clearTimeout(actionTimer)
			actionTimer = setTimeout(() => {
				console.log('  [*] 15 minute actionTimer elapsed. ')
				if (!voddo.isDownloading()) {
					console.log('  [*] stream is not being downloaded, so we are proceeding with VOD processing.')
					doProcessVod(voddo.getFilenames())
				} else {
					console.log('  [*] stream is still being downloaded, so we are not processing VOD at this time.')
				}
			}, 1000*60*15)
		}

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

