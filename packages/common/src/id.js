
import os from 'os'
import cuid from 'cuid'

export const workerId = `${os.hostname}-${cuid()}`
