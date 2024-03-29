// const VOD = require('./VOD.js');

import { projektMelodyTwitterId } from './constants.js'
import { loggerFactory } from 'common/logger'

const logger = loggerFactory({
    defaultMeta: { service: "futureporn/scout" }
})
const cbUrlRegex = /chaturbate\.com.*projektmelody/i;
const containsCBInviteLink = (tweet) => {
    try {
        if (tweet?.entities?.urls === undefined) return false;
        for (const url of tweet.entities.urls) {
        	if (url?.unwound_url !== undefined) {
                if (cbUrlRegex.test(url.unwound_url)) {
                    return true;
                } else {
                    return false;
                }
	        } else {
	        	return false;
	        }
        }
    }
    catch (e) {
        logger.log({ level: 'error', message: 'ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR' });
        logger.log({ level: 'error', message: e });
        return false;
    }
};
const deriveTitle = (text) => {
    // greetz https://www.urlregex.com/
    const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/g;
    let title = text
        .replace(urlRegex, '') // remove urls
        .replace(/\n/g, ' ') // replace newlines with spaces
        .replace(/&gt;/g, '>') // gimme dem greater-than brackets
        .replace(/&lt;/g, '<') // i want them less-thans too
        .replace(/&amp;/g, '&') // ampersands are sexy
        .replace(/\s+$/, ''); // remove trailing whitespace
    return title;
};
/**
 * Does stuff with filtered tweets. (side-effects)
 */
const processTweet = async (tweet) => {
    logger.log({ level: 'debug', message: `processTweet() is as follows \n${JSON.stringify(tweet, 0, 2)}` });
    logger.log({ level: 'debug', message: '>>> Processing Tweet' });
    logger.log({ level: 'debug', message: tweet });
    if (containsCBInviteLink(tweet)) {
        let tweetId = tweet.id;
        let tweetText = tweet.text;
        let date = tweet.created_at;
        let screenName = (tweet.author_id === projektMelodyTwitterId) ? 'ProjektMelody' : tweet.author_id;
        let announceUrl = `https://twitter.com/${screenName}/status/${tweetId}`;
        let announceTitle = deriveTitle(tweetText);
        logger.log({ level: 'debug', message: `[*] Mel Chaturbate Invite Tweet Detected: ${announceUrl} at ${date}` });
        const vod = new VOD({
            date,
            announceTitle,
            announceUrl
        });
        vod.saveMarkdown();
    }
};
export { deriveTitle };
export { processTweet };
export { containsCBInviteLink };
export default {
    deriveTitle,
    processTweet,
    containsCBInviteLink
};
