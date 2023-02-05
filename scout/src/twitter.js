#!/usr/bin/env node
import 'dotenv/config';
import Twitter from 'twitter-v2';
import { loggerFactory } from 'workspace:common/logger'

const logger = loggerFactory({
    defaultMeta: { service: "futureporn/scout" }
})

// import { processTweet } from './tweetProcess.js'; // @todo
const twitterConsumerKey = process.env.TWITTER_API_KEY;
const twitterConsumerSecret = process.env.TWITTER_API_KEY_SECRET;
const projektMelodyTwitterId = '1148121315943075841';
if (typeof twitterConsumerKey === 'undefined')
    throw new Error('TWITTER_API_KEY is undefined');
if (typeof twitterConsumerSecret === 'undefined')
    throw new Error('TWITTER_API_KEY_SECRET is undefined');
async function delay(timeout) {
    logger.log({ level: 'debug', message: `  [*] delaying for ${timeout}ms` });
    await new Promise(resolve => setTimeout(resolve, timeout));
}
var client = new Twitter({
    consumer_key: twitterConsumerKey,
    consumer_secret: twitterConsumerSecret
});
async function setup() {
    const ruleBody = {
        'add': [
            {
                'value': 'from:projektmelody -is:retweet',
                'tag': 'tweets from melody'
            }
        ]
    };
    // Delete all rules and add just the ones we want
    try {
        const { data: rules } = await client.get('tweets/search/stream/rules');
        logger.log({ level: 'debug', message: rules });
        const ruleIds = rules.map((r) => r.id);
        logger.log({ level: 'debug', message: ruleIds });
        await client.post('tweets/search/stream/rules', {
            'delete': {
                "ids": ruleIds
            }
        });
    }
    catch (e) {
        logger.log({ level: 'error', message: e });
        logger.log({ level: 'error', message: 'no big d.' });
    }
    logger.log({ level: 'debug', message: `creating rule.` });
    const ruleRes = await client.post('tweets/search/stream/rules', ruleBody);
    logger.log({ level: 'debug', message: `rule created with response ${JSON.stringify(ruleRes)}` });
}
async function listenForever(streamFactory, dataConsumer) {
    try {
        for await (const { data } of streamFactory()) {
            dataConsumer(data);
        }
        // The stream has been closed by Twitter. It is usually safe to reconnect.
        logger.log({ level: 'debug', message: 'Stream disconnected healthily. Reconnecting.' });
        listenForever(streamFactory, dataConsumer);
        await delay(5000);
    }
    catch (error) {
        // An error occurred so we reconnect to the stream. Note that we should
        // probably have retry logic here to prevent reconnection after a number of
        // closely timed failures (may indicate a problem that is not downstream).
        logger.log({ level: 'warn', message: `Stream disconnected with error. Retrying. ${error}` });
        listenForever(streamFactory, dataConsumer);
        await delay(5000);
    }
}
export default async function twitter(dataConsumer) {
    const parameters = {
        expansions: [
            'author_id'
        ],
        tweet: {
            fields: ['created_at', 'entities'],
        }
    };
    await setup();
    listenForever(() => client.stream('tweets/search/stream', parameters), dataConsumer);
}
