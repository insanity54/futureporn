#!/usr/bin/env node

import "dotenv/config"
import Voddo from './src/voddo.js'
import debugFactory from 'debug'
import dbFactory from './src/db.js'
import Capture from './src/Capture.js'
import { ipfsClusterUpload } from '../utils/ipfsCluster.js'
import Video from './src/Video.js'

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


if (typeof process.env.FUTUREPORN_WORKDIR === 'undefined') throw new Error('FUTUREPORN_WORKDIR is undefined in env');






async function ttt () {
	const foo = sql.listen('capture/taco', (idk) => {
		console.log('[ttt] idk!')
		console.log(idk)
	})
	console.log('[ttt] foo')
	console.log(foo)
	const bar = await foo
	console.log('[ttt] bar')
	console.log(bar)
}

async function rrr () {
	const foo = sql.notify('capture/taco', 'EEEEEEEEEEEEEEEEEEEeee (?)', (idk) => {
		console.log('  idk?')
		console.log(idk)
	})
	console.log('[rrr] ff')
	console.log(foo)
	const bar = await foo
	console.log('[rrr] rr')
	console.log(bar)
}


async function main () {


	const res = await db.notify('futureporn/capture', { message: 'idk!??!?!?' })
	console.log(res)

	const voddo = new Voddo({
		url: 'https://chaturbate.com/projektmelody',
		format: 'best',
		cwd: process.env.FUTUREPORN_WORKDIR
	})

	const capture = new Capture({
		voddo,
		sql,
		ipfsClusterUpload
	})

	capture.begin()
}


// main()


// ttt()
// setInterval(() => {
// 	rrr()
// }, 1000)









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

