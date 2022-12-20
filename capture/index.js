#!/usr/bin/env node

import "dotenv/config";
import aedesClientFactory from './src/aedes.js'
import Voddo from './src/voddo.js'
import debugFactory from 'debug'

const debug = debugFactory('futureporn/capture/index')

if (typeof process.env.AEDES_HOST === 'undefined') throw new Error('AEDES_HOST')
if (typeof process.env.AEDES_USERNAME === 'undefined') throw new Error('AEDES_USERNAME is undefined in env');
if (typeof process.env.AEDES_PASSWORD === 'undefined') throw new Error('AEDES_PASSWORD is undefined in env');
if (typeof process.env.FUTUREPORN_WORKDIR === 'undefined') throw new Error('FUTUREPORN_WORKDIR is undefined in env');

const aedesClient = aedesClientFactory(
	process.env.AEDES_HOST, 
	process.env.AEDES_USERNAME, 
	process.env.AEDES_PASSWORD
)

const voddo = new Voddo({
	url: 'https://chaturbate.com/projektmelody',
	format: 'worst',
	cwd: process.env.FUTUREPORN_WORKDIR
})

// voddo.delayedStart() // only for testing
voddo.start()


// voddo generates a report when it's done recording a stream
voddo.on('report', (report) => {
	aedesClient.publish('futureporn/capture/report', JSON.stringify(report))
})

voddo.on('file', (file) => {
	aedesClient.publish('futureporn/capture/file', JSON.stringify(file))
})

// on connection event:
aedesClient.on('connect', (data) => {
    debug(`  [*] MQTT connected. topic:${data.topic}`);
    aedesClient.subscribe('futureporn/scout/tweet');
});

aedesClient.on('message', (topic, message) => {
	debug(`  [*] got message. topic:${topic}, message:${JSON.stringify(message)}`)
	if (topic === 'futureporn/scout/tweet') {
		debug(`  [*] Starting voddo (again)`)
		voddo.start()
	}
})