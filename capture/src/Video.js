
import { execa } from 'execa'
import { tmpdir } from 'os'
import path from 'node:path'
import fs from 'node:fs'
import os from 'node:os'

export class VideoConcatError extends Error {
  constructor (msg) {
    super(msg || 'Failed to concatenate video')
    this.name = 'VideoConcatError'
  }
}



export default class Video {
  constructor (opts) {
    if (typeof opts.filePaths === 'undefined') throw new Error('Video must be called with opts.filePaths');
    if (typeof opts.cwd === 'undefined') throw new Error('Video must be called with opts.cwd');
    this.filePaths = opts.filePaths
    this.cwd = opts.cwd
    this.room = opts.room || 'projektmelody'
    this.execa = opts.execa || execa
  }


  getFilesTxt () {
    return this.filePaths
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((d) => `file '${d.file}'`)
      .join('\n')
      .concat('\n')
  }


  getFilesFile () {
    const p = path.join(this.cwd, 'files.txt')
    fs.writeFileSync(
      p, 
      this.getFilesTxt(this.filePaths), 
      { encoding: 'utf-8' }
    )
    return p
  }

  async concat () {
    const target = path.join(this.cwd, `${this.room}-chaturbate-${new Date().valueOf()}.mp4`)

    const { exitCode, killed, stdout, stderr } = await this.execa('ffmpeg', [
      '-y',
      '-f', 'concat',
      '-safe', '0',
      '-i', this.getFilesFile(this.filePaths),
      '-c', 'copy',
      target
    ], {
      cwd: this.cwd
    });

    if (exitCode !== 0 || killed !== false) {
      throw new VideoConcatError(`exitCode:${exitCode}, killed:${killed}, stdout:${stdout}, stderr:${stderr}`);
    }

    return target
  }
}
