#!/usr/bin/env node

import dotenv from 'dotenv'
dotenv.config()
import mqtt from "mqtt";
// Client
const SERVER = 'mqtt://commander.sbtp.xyz';
const mqTopic = 'futureporn/capture';
if (typeof process.env.MQTT_USERNAME === 'undefined') throw new Error('username not in env')

console.log(`connecting with ${process.env.MQTT_USERNAME}:${process.env.MQTT_PASSWORD}`)
let client = mqtt.connect(SERVER, { username: process.env.MQTT_USERNAME, password: process.env.MQTT_PASSWORD });
// helper function to log date+text to console:
const log = (text) => {
    console.log(`[${new Date().toLocaleString()}] ${text}`);
};
// on connection event:
client.on('connect', (message) => {
    log(`Connected to ${SERVER}`);
    client.subscribe(mqTopic);
    setInterval(() => {
        client.publish(mqTopic, 'Good Morning Motherfuckers!');
    }, 5000);
});
// on message received event:
client.on('message', (topic, message) => {
    log(`Message received on topic ${topic}: ${message.toString()}`);
});
