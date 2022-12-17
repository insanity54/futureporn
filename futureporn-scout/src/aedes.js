#!/usr/bin/env node

require('dotenv').config()

// Client
const SERVER = process.env.AEDES_HOST
const mqTopic = 'futureporn/status'

let mqtt = require('mqtt')
let client = mqtt.connect(SERVER, {
  username: process.env.AEDES_USERNAME,
  password: process.env.AEDES_PASSWORD,
  clientId: 'experimental-' + Math.random().toString(16).substr(2, 8)
})


// helper function to log date+text to console:
const log = (text) => {
  console.log(`[${new Date().toLocaleString()}] ${text}`)
}

// on connection event:
client.on(
  'connect',
  (message) => {
    log(`Connected to ${SERVER}`)
    client.subscribe(mqTopic)
  }
)

// on message received event:
client.on(
  'message',
  (topic, message) => {
    log(`Message received on topic ${topic}: ${message.toString()}`)
  }
)


setTimeout(() => {
    client.publish(mqTopic, 'Good Morning Motherfuckers!', () => {
      client.end()
    })
}, 5000)