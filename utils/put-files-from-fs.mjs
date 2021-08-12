import process from 'process'
import minimist from 'minimist'
import { Web3Storage, getFilesFromPath } from 'web3.storage'

async function main () {
  const args = minimist(process.argv.slice(2))
  const token = args.token

  if (!token) {
    console.error('A token is needed. You can create one on https://web3.storage')
    return
  }

  const fileList = args._;

  const storage = new Web3Storage({ token })

  const files = await getFilesFromPath(fileList)
  const cid = await storage.put(files)

  console.log('Content added with CID:', cid)
}

main()