

import 'dotenv/config'
import {execa} from 'execa'
import path from 'node:path'
import { saveVod, notify } from './db.js'
import { ipfsClusterUpload } from '../../utils/ipfsCluster.js'

if (typeof process.env.FUTUREPORN_WORKDIR === 'undefined') throw new Error('FUTUREPORN_WORKDIR is not defined in env!')


class VideoConcatError extends Error {
  constructor (message) {
    super(message || 'Video concatenation failed!')
    this.name = 'VideoConcatError';
  }
}




export async function doProcessVod(filenames) {
  console.log('  [doProcessVod] @todo')
  console.log(filenames)

  let vodFile;

  // concatenate if needed
  if (filenames.length > 1) {
    vodFile = await concatenateVideos(filenames)
  } else {
    vodFile = filenames.file
  }

  // upload
  const cid = await ipfsClusterUpload(vodFile)

  await saveVod({ cid: cid })
  await notify('capture/vod/upload', { cid: cid })

}


export async function concatenateVideos(filenames) {
  const target = path.join(process.env.FUTUREPORN_WORKDIR, `project-melody-chaturbate-${new Date().valueOf()}`)

  const { exitCode, killed, stdout, stderr } = await execa('ffmpeg', [
    '-y', 
    '-f', 'concat',
    '-safe', '0',
    '-i', filenames.map((f) => f.file),
    '-c', 'copy', 
    target
  ], {
    cwd: process.env.FUTUREPORN_WORKDIR
  });

  if (exitCode !== 0 || killed !== false) {
    throw new VideoConcatError(`exitCode:${exitCode}, killed:${killed}, stdout:${stdout}, stderr:${stderr}`);
  } 

  return target
}