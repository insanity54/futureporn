#!/usr/bin/env node

import "dotenv/config"
import Voddo from './src/Voddo.js'
import debugFactory from 'debug'
import Capture from './src/Capture.js'
import Ipfs from './src/Ipfs.js'
import Video from './src/Video.js'
import cuid from 'cuid'
import os from 'os'
import fs from 'node:fs'


import postgres from 'postgres'
if (typeof process.env.POSTGRES_HOST === 'undefined') throw new Error('POSTGRES_HOST undef');
if (typeof process.env.POSTGRES_USERNAME === 'undefined') throw new Error('POSTGRES_USERNAME undef');
if (typeof process.env.POSTGRES_PASSWORD === 'undefined') throw new Error('POSTGRES_PASSWORD undef');
if (typeof process.env.FUTUREPORN_WORKDIR === 'undefined') throw new Error('FUTUREPORN_WORKDIR is undefined in env');
if (typeof process.env.IPFS_CLUSTER_HTTP_API_USERNAME === 'undefined') throw new Error('IPFS_CLUSTER_HTTP_API_USERNAME in env is undefined');
if (typeof process.env.IPFS_CLUSTER_HTTP_API_PASSWORD === 'undefined') throw new Error('IPFS_CLUSTER_HTTP_API_PASSWORD in env is undefined');
if (typeof process.env.IPFS_CLUSTER_HTTP_API_MULTIADDR === 'undefined') throw new Error('IPFS_CLUSTER_HTTP_API_MULTIADDR in env is undefined');




const pkg = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf-8'}))
const workerId = `${os.hostname}-${cuid()}`
const sql = postgres({
    host: process.env.POSTGRES_HOST,
    password: process.env.POSTGRES_PASSWORD,
    username: process.env.POSTGRES_USERNAME,
    database: 'futureporn'
})



const debug = debugFactory('futureporn/capture')


if (typeof process.env.FUTUREPORN_WORKDIR === 'undefined') throw new Error('FUTUREPORN_WORKDIR is undefined in env');





async function main () {

	await sql.notify('capture/presense', { id: workerId, message: 'hello!' })

	const voddo = new Voddo({
		url: 'https://chaturbate.com/projektmelody',
		format: 'best',
		cwd: process.env.FUTUREPORN_WORKDIR
	})

	const ipfs = new Ipfs({
		multiaddr: process.env.IPFS_CLUSTER_HTTP_API_MULTIADDR,
		username: process.env.IPFS_CLUSTER_HTTP_API_USERNAME,
		password: process.env.IPFS_CLUSTER_HTTP_API_PASSWORD,
	})

	const capture = new Capture({
		voddo,
		sql,
		ipfs,
		workerId
	})

	capture.listen().download()
}

console.log(`capture version: ${pkg.version}`)
debug(`  [*] my capture directory is ${process.env.FUTUREPORN_WORKDIR}`)
main()




