// import process from 'process'
import dotenv from 'dotenv'
import minimist from 'minimist'
import { Web3Storage, getFilesFromPath } from 'web3.storage'


dotenv.config();

async function main () {
  const args = minimist(process.argv.slice(2))
  const token = process.env.WEB3_TOKEN


  console.log(`hello. args are as follows`)
  console.log(args)

  if (!token) {
    return console.error('A token is needed. (WEB3_TOKEN in env must be defined). You can create one on https://web3.storage. ')
  }

  if (args._.length < 1) {
    return console.error('Please supply the path to a file or directory')
  }

  const storage = new Web3Storage({ token })
  const files = []

  for (const path of args._) {
    const pathFiles = await getFilesFromPath(path)
    files.push(...pathFiles)
  }

  console.log(`Uploading ${files.length} files`)
  const cid = await storage.put(files)
  console.log('Content added with CID:', cid)
}

main()

 

 