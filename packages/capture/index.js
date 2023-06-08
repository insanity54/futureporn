#!/usr/bin/env node

// import Capture from './src/Capture.js'
// import Video from './src/Video.js'

import dotenv from 'dotenv'
dotenv.config()
import cuid from 'cuid'
import os from 'os'
import fs from 'node:fs'
import path from 'path'
import { loggerFactory } from "common/logger"
import Primus from 'primus'
import http from 'node:http'
import faye from 'faye'
import { record, assertDependencyDirectory } from './src/record.js'
import fastq from 'fastq'




const workQueue = fastq(captureTasks, 1)



async function captureTasks (args, cb) {
  const { appContext, playlistUrl, roomName } = args;
  try {
    const proc = record(appContext, playlistUrl, roomName)

    proc.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    // setTimeout(() => {
    //   appContext.logger.log({ level: 'debug', message: `recording in progress. ` })
    // }, 1000*30)
  } catch (err) {

  }
  appContext.logger.log({ level: 'info', message: 'Capture tasks complete'})
  cb(null, null)
}


async function init () {

  const appEnv = new Array('FUTUREPORN_WORKDIR', 'PUBSUB_SERVER_URL', 'DOWNLOADER_UA')

  const logger = loggerFactory({
    service: 'futureporn/capture'
  })

  const appContext = {
    env: appEnv.reduce((acc, ev) => {
      if (typeof process.env[ev] === 'undefined') throw new Error(`${ev} is undefined in env`);
      acc[ev] = process.env[ev];
      return acc;
    }, {}),
    logger,
    pkg: JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf-8'})),
    workerId: `${os.hostname}-${cuid()}`,
    pubsub: new faye.Client(process.env.PUBSUB_SERVER_URL)
  };

  assertDependencyDirectory(appContext)

  return appContext
}


async function main () {

  const appContext = await init()



  appContext.logger.log({ level: 'info', message: `capture version: ${appContext.pkg.version}` })
  appContext.logger.log({ level: 'debug', message: `my capture directory is ${appContext.env.FUTUREPORN_WORKDIR}` })


	// connect to realtime server
  appContext.pubsub.subscribe('/signals', (message) => {
    appContext.logger.log({ level: 'debug', message: JSON.stringify(message) })

    if (
      (message?.signal === 'start') &&
      (message?.room) &&
      (message?.url.startsWith('https://'))
    ) {
      const playlistUrl = message?.url;
      const roomName = message?.room;
      workQueue.push({appContext, playlistUrl, roomName})
    }
    // @see https://github.com/insanity54/futureporn/issues/204
    // @todo 
    // when we receive a 'start' signal from futureporn-scout, 
    // start recording
  })


	// // await sql.notify('capture/presense', { id: workerId, message: 'hello!' })

	// const voddo = new Voddo({
	// 	url: 'https://chaturbate.com/projektmelody',
	// 	format: 'best',
	// 	cwd: path.join(process.env.FUTUREPORN_WORKDIR, 'recordings')
	// })


	// const capture = new Capture({
	// 	voddo,
	// 	sql,
	// 	ipfs,
	// 	workerId
	// })

	// capture.listen().download()
}

main()




