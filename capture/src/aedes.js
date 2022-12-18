
import * as mqtt from "mqtt";
import debugFactory from 'debug'
const debug = debugFactory('futureporn/capture/aedes')


const mqReadTopic = 'futureporn/scout/tweet';


export default function aedesClientFactory (host, username, password) {
    let client = mqtt.connect(host, {
        username: username,
        password: password,
        clientId: 'futureporn-capture' + Math.random().toString(16).substr(2, 8)
    });
    return client
}