/**
 * These twitter tweets do not contain Chaturbate invite links
 * even though they have a chaturbate URL in the tweet
 */

const blacklist = [
    '1224895026318258177',  // announcement that Mel was approved to stream on CB
    '1490488097250942976',  // day-early 2 year anni announcement
];

module.exports = {
    blacklist
}
