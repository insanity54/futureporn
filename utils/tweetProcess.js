const VOD = require('./VOD.js');
const debug = require('debug')('futureporn');

const deriveTitle = (text) => {
	// greetz https://www.urlregex.com/
	const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/g;
	let title = text
		.replace(urlRegex, '') // remove urls
		.replace(/\n/g, ' ')   // replace newlines with spaces
		.replace(/\s+$/, '');  // remove trailing whitespace
	return title;
}


const getFullTweetText = (tweet) => {
	let truncated = tweet.truncated;
	if (truncated) return tweet.extended_tweet.full_text;
	else return tweet.text;
}


/**
 * Does stuff with filtered tweets. (side-effects)
 */
const processTweet = async (tweet) => {
	debug(`processTweet() is as follows \n${JSON.stringify(tweet, 0, 2)}`);
	const id = (tweet.id || tweet.user.id);
	debug('>>> Processing Tweet');
	debug(tweet);
	let tweetId = tweet.id_str;
	let tweetText = getFullTweetText(tweet);
	let date = tweet.timestamp_ms;
	let screenName = tweet.user.screen_name;
	let announceUrl = `https://twitter.com/${screenName}/status/${tweetId}`;
	let announceTitle = deriveTitle(tweetText);
	debug(`announceTitle: ${announceTitle}`);
	debug(`announceUrl: ${announceUrl}`);
	console.log(`[*] MelTweet: ${tweetId} ${date}`)
	const vod = new VOD({
		date,
		announceTitle,
		announceUrl
	})
	vod.saveMarkdown();

}


module.exports = {
	deriveTitle,
	processTweet,
	getFullTweetText
}