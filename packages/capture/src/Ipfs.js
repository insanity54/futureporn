
import {execa} from 'execa'
import {loggerFactory} from 'common/logger'

const logger = loggerFactory({
  service: 'futureporn/capture'
})

export default class Ipfs {
  constructor(opts) {
    this.multiaddr = opts?.IPFS_CLUSTER_HTTP_API_MULTIADDR
    this.username = opts?.IPFS_CLUSTER_HTTP_API_USERNAME
    this.password = opts?.IPFS_CLUSTER_HTTP_API_PASSWORD
    this.ctlExecutable = opts?.ctlExecutable || '/usr/local/bin/ipfs-cluster-ctl'
    this.ipfsExecutable = opts?.ipfsExecutable || '/usr/local/bin/ipfs'
  }
  getArgs () {
    let args = [
      '--no-check-certificate',
      '--host', this.multiaddr,
      '--basic-auth', `${this.username}:${this.password}`
    ]
    return args
  }
  async upload (filename, expiryDuration = false) {
    try {
      let args = getArgs()

      args = args.concat([
        'add', 
        '--quieter', 
        '--cid-version', 1
      ])

      if (expiryDuration) {
        args = args.concat(['--expire-in', expiryDuration])
      }

      args.push(filename)

      const { stdout } = await execa(this.ctlExecutable, args)
      return stdout
    } catch (e) {
      logger.log({ level: 'error', message: 'Error while adding file to ipfs' })
      logger.log({ level: 'error', message: e })
    }
  }
  async hash (filename) {
    try {
      const { stdout } = await execa(this.ipfsExecutable, ['add', '--quiet', '--cid-version=1', '--only-hash', filename])
      return stdout
    } catch (e) {
      logger.log({ level: 'error', message: 'Error while hashing file' })
      logger.log({ level: 'error', message: e })
    }
  }
}