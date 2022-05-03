#!/usr/bin/env node


/**
 * 
 * historian
 *
 *   - Finds all Melody's Tweets containing a Chaturbate invite link
 *   - Creates a markdown file for each
 *
 *  This module is used for finding Chaturbate streams that occured in the past.
 *  This helps Futureporn reach 100% completion by finding Chaturbate streams
 *  that occured during times we were not actively following Melody. 
 * 
 */

require('dotenv').config();
const debug = require('debug')('futureporn');

const { projektMelodyTwitterId, localTimeZone } = require('./constants.js');

const TwitterClient = require('twitter-api-scraper').default;
// const Twitter = require('twitter-lite');
// const Twitter = require('twitter-v2');
const Datastore = require('nedb-promises');
const os = require('os');
const path = require('path');
const { deriveTitle, containsCBInviteLink } = require('./tweetProcess.js');
const { isBefore, add, formatISO, parseISO } = require('date-fns')
const { zonedTimeToUtc, utcToZonedTime, format, formatInTimeZone } = require('date-fns-tz')
const VOD = require('./VOD.js')
const { blacklist } = require('./tweetBlacklist.js');

const datastore = Datastore.create(path.join(os.tmpdir(), 'projektmelody-tweets.db'));
// const twitterConsumerKey = process.env.TWITTER_API_KEY;
// const twitterConsumerSecret = process.env.TWITTER_API_KEY_SECRET;
// const twitterAccessToken = process.env.TWITTER_ACCESS_TOKEN;
// const twitterAccessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;
const timeout = 6*1000; // optional HTTP request timeout to apply to all requests.
const strictSSL = true;  // optional - requires SSL certificates to be valid.
const projektMelodyEpoch = new Date('2020-02-07T23:21:48.000Z');


function later(delay, value) {
    return new Promise(resolve => setTimeout(resolve, delay, value));
}



/**
 * get dates spaced a few days apart
 * starting on ProjektMelodyEpoch (2020-02-07)
 */
const getDateRange = function* () {
    let dateCounter = projektMelodyEpoch;
    while (isBefore(dateCounter, new Date())) {
        const start = dateCounter;
        const end = add(dateCounter, { days: 8 });
        dateCounter = end;
        yield [ start, end ];
    }
}





const search = async (client, scraperQuery, nextToken, startDate, endDate) => {

    await later(200, null) // courtesy delay

    const result = await client.search(scraperQuery, 100, nextToken);

    const tweets = result?.tweets;
    if (tweets) {
        for (const tweetId in tweets) {
            const tweet = tweets[tweetId]
            console.log(`  [🐦] ${tweet.id_str} ${tweet.full_text.substring(0, 70)}`);
            await datastore.update({ id: tweet.id }, tweet, { upsert: true });
        }
    }

    // get the next page if there is one
    if (result?.nextToken) {
        return search(client, scraperQuery, result.nextToken, startDate, endDate);
    }

    else return;
}



/**
 * 
 * query Twitter API for all of Mel's tweets
 * 
 * @warning There is a potential future problem with the /2/users/:id/tweets endpoint 
 *          in that pagination only returns the 3200 most recent tweets. 
 *          A potential workaround could be date-based search,
 *          but this is a future problem as we're only seeing ~2300 tweets as of May 1 2022
 * 
 *          see https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-tweets
 * 
 */
async function query(client, startDate, endDate) {

    const scraperQuery = { terms: `from:projektmelody -filter:retweets filter:links since:${formatISO(startDate)} until:${formatISO(endDate)}` };
    await search(client, scraperQuery, undefined, startDate, endDate)

}   


const getAllTweets = async() => {
    const client = new TwitterClient();
    await client.connect()


    // get all of Mel's tweets
    // because there is a limit of 3200 tweets
    // using regular pagination method, we instead
    // scrape twitter, making several searches using 5 day ranges
    // between the date that melody started streaming on CB and now
    for await (let [start, end] of getDateRange()) {
        await query(client, start, end);
    }
};

const filterInviteTweets = async() => {
    const tweets = await datastore.find({}).sort({ id: 1 });

    console.log(`  [*] there are a total of ${tweets.length} tweets.`);

    let inviteTweets = [];
    for (const tweet of tweets) {
        if (containsCBInviteLink(tweet)) {
            console.log(deriveTitle(tweet.text || tweet.full_text));
            if (!blacklist.includes(tweet.id_str || tweet.id)) inviteTweets.push(tweet)
        }
    }
    console.log(`  There are ${inviteTweets.length} invite tweets`)

    return inviteTweets;
};


/**
 * create or update markdown files for each invite tweet
 */
const updateMarkdownFiles = async (inviteTweets) => {
    if (!inviteTweets) throw new Error('there were no inviteTweets passed to updateMarkdownFiles()');



    
    for (const tweet of inviteTweets) {
        if (tweet?.created_at === 'undefined') throw new Error(`  [e] tweet ${tweet.id_str} is missing date (tweet.created_at)`)

        const utcDate = zonedTimeToUtc(new Date(tweet.created_at), localTimeZone);
        const formattedDate = formatInTimeZone(utcDate, 'Zulu', "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        const safeDate = formatInTimeZone(utcDate, 'Zulu', "yyyyMMdd'T'HHmmss'Z'");

        // console.log(`  [o] utcDate:${utcDate} the formattedDate is ${formattedDate} and the safeDate is ${safeDate}`);

        const announceTitle = deriveTitle(tweet.text || tweet.full_text);

        const vod = new VOD({ date: formattedDate });

        // find existing VOD (already on disk)
        try {
            await vod.loadMarkdown();

        } catch (e) {
            // console.log(e)
            console.log(`  [✨] [${safeDate}] [https://twitter.com/ProjektMelody/status/${tweet.id_str || tweet.id}] tweet "${announceTitle.substring(0, 80)}"`);
        }


        vod.mergeProperties({
            announceTitle: announceTitle,
            announceUrl: `https://twitter.com/ProjektMelody/status/${tweet.id_str || tweet.id}`,
            date: formattedDate,
            layout: 'layouts/vod.njk'
        });

        // console.log(vod);


        await vod.saveMarkdown()

    }
}


(async function main () {


    // await getAllTweets();
    const inviteTweets = await filterInviteTweets();
    await updateMarkdownFiles(inviteTweets);



})()

