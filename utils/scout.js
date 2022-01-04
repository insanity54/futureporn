#!/usr/bin/env node


require('dotenv').config();
const debug = require('debug')('futureporn');

// const Twitter = require('twitter-lite');
const Twitter = require('twitter-v2');
const { processTweet } = require('./tweetProcess.js');


const twitterConsumerKey = process.env.TWITTER_API_KEY;
const twitterConsumerSecret = process.env.TWITTER_API_KEY_SECRET;
const twitterAccessToken = process.env.TWITTER_ACCESS_TOKEN;
const twitterAccessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;
const timeout = 60*1000; // optional HTTP request timeout to apply to all requests.
const strictSSL = true;  // optional - requires SSL certificates to be valid.


var client = new Twitter({
	// extension: false,
	// version: "2",
	consumer_key:         twitterConsumerKey,
	consumer_secret:      twitterConsumerSecret,
	// access_token_key:     twitterAccessToken,
	// access_token_secret:  twitterAccessTokenSecret
})


//const parameters = {
//	follow: projektMelodyTwitterId,
//	track: "chaturbate.com/in"
//}

// const ruleBody = {
// 	'add': [
// 		{ 
// 			'value': 'from:projektmelody -is:retweet',
// 			'tag': 'tweets from melody'
// 		}
// 	]
// };

const ruleBody = {
	'add': [
		{
			'value': 'from:test5f1798',
			'tag': 'test tweets'
		}
	]
}

const parameters = {
  expansions: [ 'author_id', 'referenced_tweets.id' ],
  tweet: {
    fields: ['created_at'],
  },
  user: {
  	fields: ['description', 'name', 'username']
  }
}


async function setup() {
	// EXAMPLE: delete old rules
	// await client.post('tweets/search/stream/rules',
	// {
	// 	'delete': {
	// 		"ids": [
	// 			"1416377627577749514",
	// 			"1416386720669392901",
	// 			"1437569472114606080"
	// 		]
	// 	}
	// })

	debug('getting existing rules')
	const ruleQueryRes = await client.get('tweets/search/stream/rules');
	debug(ruleQueryRes)


	debug(`creating rule.`)
	const ruleRes = await client.post('tweets/search/stream/rules', ruleBody);
	debug(`rule created with response ${JSON.stringify(ruleRes)}`);

}	


async function listenForever(streamFactory, dataConsumer) {
  try {
    for await (const { data } of streamFactory()) {
      dataConsumer(data);
    }
    // The stream has been closed by Twitter. It is usually safe to reconnect.
    console.log('Stream disconnected healthily. Reconnecting.');
    listenForever(streamFactory, dataConsumer);
  } catch (error) {
    // An error occurred so we reconnect to the stream. Note that we should
    // probably have retry logic here to prevent reconnection after a number of
    // closely timed failures (may indicate a problem that is not downstream).
    console.warn('Stream disconnected with error. Retrying.', error);
    listenForever(streamFactory, dataConsumer);
  }
}



(async function main () {
	await setup()

	listenForever(
	  () => client.stream('tweets/search/stream', parameters),
	  (data) => processTweet(data)
	);
})()
