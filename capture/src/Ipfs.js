
import {execa} from 'execa'




export default class Ipfs {
  constructor(opts) {
    this.IPFS_CLUSTER_HTTP_API_MULTIADDR = opts.IPFS_CLUSTER_HTTP_API_MULTIADDR
    this.IPFS_CLUSTER_HTTP_API_USERNAME = opts.IPFS_CLUSTER_HTTP_API_USERNAME
    this.IPFS_CLUSTER_HTTP_API_PASSWORD = opts.IPFS_CLUSTER_HTTP_API_PASSWORD
  }
  getArgs () {
    let args = [
      '--no-check-certificate',
      '--host', this.IPFS_CLUSTER_HTTP_API_MULTIADDR,
      '--basic-auth', `${this.IPFS_CLUSTER_HTTP_API_USERNAME}:${this.IPFS_CLUSTER_HTTP_API_PASSWORD}`
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

      const { stdout } = await execa(ipfsClusterExecutable, args)
      return stdout
    } catch (e) {
      console.error('Error while adding file to ipfs')
      console.error(e)
    }
  }
}