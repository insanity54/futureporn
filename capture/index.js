#!/usr/bin/env node

import "dotenv/config";
import Voddo from './src/voddo.js'
import debugFactory from 'debug'
import Redis from 'ioredis';
import cuid from 'cuid';

const debug = debugFactory('futureporn/capture/index')
const redisUsername = process.env.REDIS_USERNAME;
const redisPassword = process.env.REDIS_PASSWORD;
const redisHost = process.env.REDIS_HOST;
const workerId = cuid();

if (typeof redisHost === 'undefined') throw new Error('REDIS_HOST undef');
if (typeof redisUsername === 'undefined') throw new Error('REDIS_USERNAME undef');
if (typeof redisPassword === 'undefined') throw new Error('REDIS_PASSWORD undef');
if (typeof process.env.FUTUREPORN_WORKDIR === 'undefined') throw new Error('FUTUREPORN_WORKDIR is undefined in env');


const sub = new Redis({
    port: 6379,
    host: redisHost,
    username: redisUsername,
    password: redisPassword
})

const pub = new Redis({
    port: 6379,
    host: redisHost,
    username: redisUsername,
    password: redisPassword
})

const voddo = new Voddo({
	url: 'https://chaturbate.com/projektmelody',
	format: 'best',
	cwd: process.env.FUTUREPORN_WORKDIR
})

// voddo.delayedStart() // only for testing
voddo.start()


// @TODO

// voddo generates a report when it's done recording a stream
voddo.on('report', (report) => {
	pub.publish('futureporn/capture/report', JSON.stringify(report));
})

voddo.on('file', (file) => {
	pub.publish('futureporn/capture/file', JSON.stringify(file))
})

sub.on('connect', (channel) => {
	debug(`  [*] Redis subscription connected to channel ${channel}`)
})

sub.on('message', (channel, message) => {
	debug(`  [*] got message. channel:${channel}, message:${JSON.stringify(message)}`)
	if (channel === 'futureporn/scout') {
		debug(`  [*] Starting voddo`)
		voddo.start()
	}
})

sub.subscribe('futureporn/scout', () => {
	pub.publish('futureporn/capture', { message: `${workerId} listening}` })
})

