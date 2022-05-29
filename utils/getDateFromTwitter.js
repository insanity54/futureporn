#!/usr/bin/env node

const argv = require('argv');
const VOD = require('./VOD.js');
const options = {
    name: 'announceUrl',
    short: 'u',
    type: 'string',
    description: 'The URL to a tweet',
};
const { localTimeZone } = require('./constants');
const { utcToZonedTime, format } = require('date-fns-tz');
const args = argv.option( options ).run();

(async () => {
    if (typeof args.options.announceUrl === 'undefined') throw new Error('--announceUrl was undefined but it must be defined.');

    const v = new VOD({
        announceUrl: args.options.announceUrl
    });

    const vv = await v.getDateFromTwitter();

    console.log('date is as follows');
    console.log(vv.date);
    console.log(`  [d] getDatestamp result: ${v.getDatestamp()}`);
})();
