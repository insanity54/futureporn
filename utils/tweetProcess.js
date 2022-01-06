const VOD = require('./VOD.js');
const debug = require('debug')('futureporn');
const projektMelodyTwitterId = require('./constants.js').projektMelodyTwitterId;
const cbUrlRegex = /chaturbate\.com.*projektmelody/i

const containsCBInviteLink = (tweet) => {
	try {
		if tweet?.entities.urls === undefined return false;
		for (url of tweet.entities.urls.) {
			if (cbUrlRegex.test(url.unwound_url)) {
				return true;
			} else {
				return false;
			}
		}
	} catch (e) {
		console.error(e);
		return false;
	}
}


const deriveTitle = (text) => {
	// greetz https://www.urlregex.com/
	const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/g;
	let title = text
		.replace(urlRegex, '') // remove urls
		.replace(/\n/g, ' ')   // replace newlines with spaces
		.replace(/\s+$/, '');  // remove trailing whitespace
	return title;
}



/**
 * Does stuff with filtered tweets. (side-effects)
 */
const processTweet = async (tweet) => {
	debug(`processTweet() is as follows \n${JSON.stringify(tweet, 0, 2)}`);
	debug('>>> Processing Tweet');
	debug(tweet);

	if (containsCBInviteLink(tweet)) {
		let tweetId = tweet.id;
		let tweetText = tweet.text;
		let date = tweet.created_at;
		let screenName = (tweet.author_id === projektMelodyTwitterId) ? 'ProjektMelody' : tweet.author_id;
		let announceUrl = `https://twitter.com/${screenName}/status/${tweetId}`;
		let announceTitle = deriveTitle(tweetText);

		console.log(`[*] Mel Chaturbate Invite Tweet Detected: ${announceUrl} at ${date}`);
		const vod = new VOD({
			date,
			announceTitle,
			announceUrl
		})
		vod.saveMarkdown();
	}

}


module.exports = {
	deriveTitle,
	processTweet,
	containsCBInviteLink
}