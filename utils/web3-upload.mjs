import dotenv from 'dotenv'
import minimist from 'minimist'
import { Web3Storage, getFilesFromPath } from 'web3.storage'


dotenv.config();


async function getFiles(path) {
  const files = await getFilesFromPath(path)
  console.log(`read ${files.length} file(s) from ${path}`)
  return files
}

async function upload (opts) {
  const { token, file } = opts;
  if (typeof token === 'undefined') {
    throw new Error('A web3.storage token "token" must be passed in options object, but token was undefined.')
  }
  if (typeof file === 'undefined') {
    throw new Error('file was undefined.')
  }


  const filesObject = await getFiles(file)
  console.log(filesObject)

  await storeWithProgress(filesObject);
}

function getAccessToken() {
  const token = process.env.WEB3_TOKEN;
  if (typeof token === 'undefined') {
    return console.error('A token is needed. (WEB3_TOKEN in env must be defined). You can create one on https://web3.storage. ')
  }
  console.log(`token is ${token}`)
  return token
}


function makeStorageClient() {
  const client = new Web3Storage({ token: getAccessToken() })
  console.log(client)
  return client
}

async function storeWithProgress(files) {  

  console.log(`uploading files`)
  console.log(files)

  // show the root cid as soon as it's ready
  const onRootCidReady = cid => {
    console.log('uploading files with cid:', cid)
  }

  // when each chunk is stored, update the percentage complete and display
  const totalSize = files.map(f => f.size).reduce((a, b) => a + b, 0)
  let uploaded = 0

  const onChunkStored = size => {
    uploaded += size
    const pct = totalSize / uploaded
    console.log(`Uploading... ${pct.toFixed(2)}% complete`)
  }

  // makeStorageClient returns an authorized Web3.Storage client instance
  const client = makeStorageClient()

  // client.put will invoke our callbacks during the upload
  // and return the root cid when the upload completes
  return client.put(files, { onRootCidReady, onChunkStored })
}

 
function getCliArgs () {
  const args = minimist(process.argv.slice(2))

  if (args._.length < 1) {
    return console.error('Please supply the path to a file or directory')
  }

  const filePath = args._

  console.log(filePath)
  return filePath;
}


async function main () {

  await upload({
    file: getCliArgs(),
    token: getAccessToken()
  })
}

main()

 
