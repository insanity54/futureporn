import fetch from 'node-fetch'
import Fastify from 'fastify'
import * as data from './package.json' assert { type: "json" }
import { ToadScheduler, SimpleIntervalJob, AsyncTask } from 'toad-scheduler'
import Cluster from 'common/Cluster'
// import { addMissingPins } from './src/missingPinsTask'

const version = data.default.version
const port = process.env.PORT || 5000
const scheduler = new ToadScheduler()
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

    fastify.get('/qa/v1/pin-health', async function (request, reply) {
        reply.type('application/json')
        const pins = await ipfsClusterStatusAll()

        // const status = await ipfsClusterStatus()
        const counts = pins.reduce((acc, pin) => {
          const lookup = { pinned: 'pinnedCount', pin_queued: 'queuedCount', pinning: 'pinningCount' }
          Object.values(pin.peer_map).forEach(peer => {
            acc[lookup[peer.status]]++
          })
          return acc
        }, { pinnedCount: 0, queuedCount: 0, pinningCount: 0 })

        console.log(counts)

        return {
            healthy: (counts.queuedCount === 0 && counts.pinningCount === 0) ? true : false,
            pinned: counts.pinnedCount,
            queued: counts.queuedCount,
            pinning: counts.pinningCount,
            message: 'Pin health of all the pins in the pinset'
        }
        // return {
        //     healthy: false,
        //     // status: status,
        //     message: 'PIN status of a single CID'
        // }
    })


    // Run the server!
    fastify.listen({ port }, function (err, address) {
      if (err) {
        fastify.log.error(err)
        process.exit(1)
      }
      fastify.log.info(`QA server ${version} listening on ${address}`)
    })

    // schedule a regular check
    const task = new AsyncTask('add any missing pins to the cluster pinset', async () => {
     fastify.log.info('Task triggered')
     const missingPins = await checkPins()
     await addMissingPins(missingPins)
    }, (err) => {
     fastify.log.error('there was an error while running the task')
     fastify.log.error(err)
    })

    const job = new SimpleIntervalJob({ minutes: 15, runImmediately: false }, task)
    scheduler.addSimpleIntervalJob(job)



}

async function getRequiredPins() {
    const res = await fetch('https://portal.futureporn.net/api/vods')
    const data = await res.json()

    console.log(data[0])

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


async function addMissingPins (missingPins) {
    for (const pin of missingPins) {
        console.log(`  [*] pinning ${pin}`)
        await ipfsClusterPinAdd(pin)
    }
}


async function checkPins() {
    // download pinset from Futureporn IPFS cluster
    const existingPins = await getExistingPins()
    console.log(` [*] there ${existingPins.length} existing pins`)

    // download VODs list from Futureporn API
    const requiredPins = await getRequiredPins()

    // compare
    const difference = requiredPins.filter(x => !existingPins.includes(x)); // greets https://stackoverflow.com/a/33034768/1004931
    const missing = difference
        .filter((d) => d.removed === true)
        .map((m) => m.value.flat())
        .flat()

    console.log(missing)

    // expose results on /api/v1/pins
    return missing
}

main()