
import "dotenv/config";
import * as mqtt from "mqtt";
import debugFactory from 'debug'
const debug = debugFactory('futureporn-scout')

if (typeof process.env.AEDES_USERNAME === 'undefined') throw new Error('AEDES_USERNAME is undefined in env');
if (typeof process.env.AEDES_PASSWORD === 'undefined') throw new Error('AEDES_PASSWORD is undefined in env');
if (typeof process.env.AEDES_HOST === 'undefined') throw new Error('AEDES_HOST')



export default function aedesClientFactory () {
    // Client
    const SERVER = process.env.AEDES_HOST;
    const mqTopic = 'futureporn/futureporn-scout';
    let client = mqtt.connect(SERVER, {
        username: process.env.AEDES_USERNAME,
        password: process.env.AEDES_PASSWORD,
        clientId: 'experimental-' + Math.random().toString(16).substr(2, 8)
    });


    // on connection event:
    client.on('connect', (message) => {
        debug(`Connected to ${SERVER}`);
        client.subscribe(mqTopic);
    });
    return client
}