
import 'dotenv/config'
import { execa } from 'execa'
import postgres from 'postgres'

if (typeof process.env.POSTGRES_PASSWORD === 'undefined') throw new Error('POSTGRES_PASSWORD not exist in env');
if (typeof process.env.POSTGRES_USERNAME === 'undefined') throw new Error('POSTGRES_USERNAME not exist in env');

const sql = postgres({
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD
})

function perms () {
  console.log('perms')
  execa('docker', [
    'run',
    '-it',
    '--rm',
    '-v', 'pgdata:/var/lib/postgresql/data',
    'bash', 
    'chown','-R', '1000:1000', '/var/lib/postgresql/data'
  ]).stdout.pipe(process.stdout);
}

function daemon () {
  console.log('postgres')
  execa('docker', [
    'run', 
    '--rm', 
    '-p', '5432:5432',
    '--name', 'postgres-futureporn',
    '-v', 'pgdata:/var/lib/postgresql/data',
    '-e', `POSTGRES_USER=${process.env.POSTGRES_USERNAME}`,
    '-e', `POSTGRES_PASSWORD=${process.env.POSTGRES_PASSWORD}`,
    'postgres'
  ]).stdout.pipe(process.stdout);
}

async function seed () {
  console.log('seeding table')
  await sql`CREATE TABLE IF NOT EXISTS vod (
    "id" UUID PRIMARY KEY not null DEFAULT gen_random_uuid() UNIQUE,
    "title" TEXT, 
    "videoSrc" TEXT UNIQUE,
    "videoSrcHash" TEXT UNIQUE,
    "video720Hash" TEXT UNIQUE,
    "video480Hash" TEXT UNIQUE,
    "video360Hash" TEXT UNIQUE,
    "video240Hash" TEXT UNIQUE,
    "thinHash" TEXT UNIQUE,
    "thiccHash" TEXT UNIQUE,
    "announceTitle" TEXT,
    "announceUrl" TEXT,
    "date" DATE,
    "captureDate" DATE,
    "note" TEXT,
    "tmpFilePath" TEXT,
    "tags" TEXT[]
  )`
}



perms()
daemon()

setTimeout(async () => {
  await seed()
  console.log('ready')
}, 1000)
