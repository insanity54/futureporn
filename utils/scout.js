
import * as dotenv from 'dotenv'
dotenv.config();

// const Twitter = require('twitter-lite');
import Twitter from 'twitter-v2';
import { processTweet } from './tweetProcess.js';

console.log(processTweet);

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

const ruleBody = {
	'add': [
		{ 
			'value': 'from:projektmelody -is:retweet',
			'tag': 'tweets from melody'
		}
	]
};

const parameters = {
	
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

	console.log('getting existing rules')
	const ruleQueryRes = await client.get('tweets/search/stream/rules');
	console.log(ruleQueryRes)


	console.log(`creating rule.`)
	const ruleRes = await client.post('tweets/search/stream/rules', ruleBody);
	console.log(`rule created with response ${JSON.stringify(ruleRes)}`);

}	


async function listenForever(streamFactory, dataConsumer) {
  try {
    for await (const { data } of streamFactory()) {
      dataConsumer(data);
    }
    // The stream has been closed by Twitter. It is usually safe to reconnect.
    console.log('Stream disconnected healthily. Reconnecting.');
    setTimeout(() => {
    	listenForever(streamFactory, dataConsumer);
    }, 3000);
  } catch (error) {
    // An error occurred so we reconnect to the stream. Note that we should
    // probably have retry logic here to prevent reconnection after a number of
    // closely timed failures (may indicate a problem that is not downstream).
    console.warn('Stream disconnected with error. Retrying.', error);
    setTimeout(() => {
    	listenForever(streamFactory, dataConsumer);
    }, 3000);
  }
}


(async function main () {
	await setup()

	const stream = await client.stream('tweets/search/stream', parameters)
	console.log(stream)
	listenForever(
	  () => client.stream('tweets/search/stream', parameters),
	  (data) => console.log(data)
	);
})()
