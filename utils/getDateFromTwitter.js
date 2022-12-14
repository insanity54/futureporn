#!/usr/bin/env node

const debug = require('debug')('futureporn')
const argv = require('argv');
const VOD = require('./VOD.js');
const options = {
    name: 'announceUrl',
    short: 'u',
    type: 'string',
    description: 'The URL to a tweet',
};
const { later, localTimeZone } = require('./constants');
const { utcToZonedTime, format } = require('date-fns-tz');
const args = argv.option( options ).run();

(async () => {
    if (typeof args.options.announceUrl === 'undefined') throw new Error('--announceUrl was undefined but it must be defined.');

    const v = new VOD({
        announceUrl: args.options.announceUrl
    });

    const vv = await v.getDateFromTwitter();

    debug('  [d]date is as follows');
    debug(`  [d] ${vv.date}`);
    debug(`  [d] getDatestamp result: ${v.getDatestamp()}`);

    const output = {
        safeDatestamp: v.getSafeDatestamp(),
        datestamp: v.getDatestamp()
    }

    console.log(output)

})();
