
import 'dotenv/config'
import { execa } from 'execa'
import { tmpdir } from 'os'
import path from 'node:path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'node:fs'
import os from 'node:os'

const __dirname = dirname(fileURLToPath(import.meta.url));
if (typeof process.env.FUTUREPORN_WORKDIR === 'undefined') throw new Error('FUTUREPORN_WORKDIR is not defined in env!')


export function getFilesTxt (data) {
  return data
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((d) => `file '${d.file}'`)
    .join('\n')
    .concat('\n')
}


export function getFilesFile (data, options) {
  const p = path.join(options.cwd, 'files.txt')
  fs.writeFileSync(p, getFilesTxt(data), { encoding: 'utf-8' })
  return p
}

export async function concat (data, options) {
  const target = path.join(process.env.FUTUREPORN_WORKDIR, `project-melody-chaturbate-${new Date().valueOf()}.mp4`)

  const { exitCode, killed, stdout, stderr } = await execa('ffmpeg', [
    '-y', 
    '-f', 'concat',
    '-safe', '0',
    '-i', getFilesFile(data, options),
    '-c', 'copy', 
    target
  ], options);

  if (exitCode !== 0 || killed !== false) {
    throw new VideoConcatError(`exitCode:${exitCode}, killed:${killed}, stdout:${stdout}, stderr:${stderr}`);
  }

  return target
}