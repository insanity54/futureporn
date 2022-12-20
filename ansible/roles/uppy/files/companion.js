#!/usr/bin/env node

import 'dotenv/config';
import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import companion from '@uppy/companion'
import config from './config.js';
import cuid from '@bugsnag/cuid';
import { SMTPClient } from 'emailjs';
import connectRedis from 'connect-redis';
import Redis from "ioredis";


const RedisStore = connectRedis(session);

const app = express();

const sessionSecret = (typeof process.env.SESSION_SECRET === 'undefined' || process.env.SESSION_SECRET.length === 0) ? cuid() : process.env.SESSION_SECRET;
if (typeof process.env.SMTP_PASSWORD === 'undefined')  throw new Error('SMTP_PASSWORD is undefined in env, but it is required.');
if (typeof process.env.SMTP_USER === 'undefined')  throw new Error('SMTP_USER is undefined in env, but it is required.');
if (typeof process.env.SMTP_HOST === 'undefined')  throw new Error('SMTP_HOST is undefined in env, but it is required.');


let redisClient = new Redis()



app.use(bodyParser.json())
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: sessionSecret,
    resave: false,
  })
)







const smtp = new SMTPClient({
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD,
  host: process.env.SMTP_HOST,
  ssl: true,
});


// tweak the s3 config so we can
// add a dynamic getKey
// and also send an e-mail alert when a key is generated

config.providerOptions.s3.getKey = (req, filename, metadata) => {
  try {
    smtp.send(
      {
        text: `New upload via https://futureporn.net/upload\n\nmetadata:${JSON.stringify(metadata, 0, 2)}\n\nfilename:${filename}\n\nurl:https://f000.backblazeb2.com/file/futureporn-uppy/${filename}`,
        from: `Futureporn <${process.env.SMTP_USER}>`,
        to: 'CJ_Clippy <cj@futureporn.net>',
        subject: 'Futureporn Upload Notification',
      },
      (err, message) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`  [*] e-mail sent.`);
          console.log(message)
        }
      }
    );
    console.log(`  [*] Getting s3 key function has executed. metadata is ${JSON.stringify(metadata)}`);
  } catch (e) {
    console.error('  [e] problem while sending e-mail.')
    console.error(e)
  }
  return `${filename}`;
}

console.log(config);
console.log('and1 the JHSONSTIRINGINFY config:')
console.log(JSON.stringify(config, 0, 2))
app.use('/', companion.app(config));

const port = process.env.PORT || 3000
const server = app.listen(port)

companion.socket(server)


console.log(app)