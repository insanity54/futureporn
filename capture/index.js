#!/usr/bin/env node

import "dotenv/config"
import Voddo from './src/Voddo.js'
import debugFactory from 'debug'
import Capture from './src/Capture.js'
import { ipfsClusterUpload } from '../utils/ipfsCluster.js'
import Video from './src/Video.js'
import cuid from 'cuid'

import postgres from 'postgres'
if (typeof process.env.POSTGRES_HOST === 'undefined') throw new Error('POSTGRES_HOST undef');
if (typeof process.env.POSTGRES_USERNAME === 'undefined') throw new Error('POSTGRES_USERNAME undef');
if (typeof process.env.POSTGRES_PASSWORD === 'undefined') throw new Error('POSTGRES_PASSWORD undef');
if (typeof process.env.FUTUREPORN_WORKDIR === 'undefined') throw new Error('FUTUREPORN_WORKDIR is undefined in env');
if (typeof process.env.IPFS_CLUSTER_HTTP_API_USERNAME === 'undefined') throw new Error('IPFS_CLUSTER_HTTP_API_USERNAME in env is undefined');
if (typeof process.env.IPFS_CLUSTER_HTTP_API_PASSWORD === 'undefined') throw new Error('IPFS_CLUSTER_HTTP_API_PASSWORD in env is undefined');
if (typeof process.env.IPFS_CLUSTER_HTTP_API_MULTIADDR === 'undefined') throw new Error('IPFS_CLUSTER_HTTP_API_MULTIADDR in env is undefined');




const workerId = cuid()
const sql = postgres({
    host: process.env.POSTGRES_HOST,
    password: process.env.POSTGRES_PASSWORD,
    username: process.env.POSTGRES_USERNAME,
    database: 'futureporn'
})



const debug = debugFactory('futureporn/capture/index')


if (typeof process.env.FUTUREPORN_WORKDIR === 'undefined') throw new Error('FUTUREPORN_WORKDIR is undefined in env');





async function main () {

	await sql.notify('capture/presense', { id: workerId, message: 'hello!' })

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

	capture.listen().download()
}


main()




