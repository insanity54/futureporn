import fetch from 'node-fetch'
import Fastify from 'fastify'
import * as data from './package.json' assert { type: "json" }
// import { ToadScheduler, SimpleIntervalJob, AsyncTask } from 'toad-scheduler'
import ipfsCluster from '../utils/ipfsCluster.js'
import * as Diff from 'diff'

const { ipfsClusterPinsQuery } = ipfsCluster;
const version = data.default.version
const port = process.env.PORT || 5000
// const scheduler = new ToadScheduler()
const ipfsHashRegex = /Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,}/;





async function main() {
    const fastify = Fastify({
      logger: true
    })


    // Declare a route
    fastify.get('/qa/v1/missing-pins', async function (request, reply) {
        reply.type('application/json')
        const missing = await checkPins()
        return {
            missing: missing,
            complete: (missing.length === 0),
            message: 'These are the pins listed on the Futureporn API that are currently missing from the IPFS cluster'
        }
    })


    // Run the server!
    fastify.listen({ port }, function (err, address) {
      if (err) {
        fastify.log.error(err)
        process.exit(1)
      }
      fastify.log.info(`QA server ${version} listening on ${address}`)
    })

    // // schedule a regular check
    // const task = new AsyncTask('check the pins', () => {
    //  fastify.log.info('Task triggered')
    //  return checkPins()
    // }, (err) => {
    //  fastify.log.error('there was an error while running the task')
    //  fastify.log.error(err)
    // })

    // const job = new SimpleIntervalJob({ minutes: 15, runImmediately: true }, task)
    // scheduler.addSimpleIntervalJob(job)



}

async function getRequiredPins() {
    const res = await fetch('https://futureporn.net/api/v1.json')
    const data = await res.json()

    const vods = data?.vods
    if (typeof vods === 'undefined') throw new Error('futureporn api was missing VODs');

    const hashes = vods
        .map((v) => [
            v.thiccHash,
            v.thinHash,
            v.video240Hash,
            v.videoSrcHash
        ])
        .flat()
        .filter((v) => v !== '')
        .map((h) => h.split('?')[0])

    // console.log('  [*] got data')
    // console.log(hashes)

    return hashes
}



async function getExistingPins () {
    const data = await ipfsClusterPinsQuery()
    // console.log(data)
    const p = data.map((p) => p.cid);
    // console.log(p)
    // console.log('thats it!')
    return p
}


async function checkPins() {
    // download pinset from Futureporn IPFS cluster
    const existingPins = await getExistingPins()
    console.log(` [*] there ${existingPins.length} existing pins`)

    // download VODs list from Futureporn API
    const requiredPins = await getRequiredPins()
    console.log(` [*] there ${requiredPins.length} required pins`)

    console.log(`1:${existingPins[0]}, 2:${requiredPins[0]}`)

    // compare
    const difference = Diff.diffArrays(requiredPins, existingPins)
    const missing = difference
        .filter((d) => d.removed === true)
        .map((m) => m.value.flat())
        .flat()

    console.log(missing)

    // expose results on /api/v1/pins
    return missing
}

main()