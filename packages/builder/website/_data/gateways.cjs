// a list of ipfs gateways which a visitor can choose from

const debug = require('debug')('futureporn')

const EleventyFetch = require("@11ty/eleventy-fetch");


const futurepornExclusiveGateways = [
  {
    hostname: 'gw.futureporn.net',
    pattern: 'https://gw.futureporn.net/ipfs/:hash',
    note: 'patrons only'
  }
]

const publicGatewayBlacklist = [
  'https://cloudflare-ipfs.com/ipfs/:hash' // doesnt allow streaming video
]



module.exports = async function() {

  const publicGatewayNames = await EleventyFetch('https://github.com/ipfs/public-gateway-checker/raw/master/src/gateways.json', {
    duration: '1w',
    type: 'json'
  })

  const publicGateways = publicGatewayNames
    .filter((gw) => (!publicGatewayBlacklist.includes(gw)))
    .map((gw) => ({ 
      pattern: gw, 
      url: gw.replace(':hash', ''), 
      hostname: new URL(gw).hostname 
    }))

  debug(publicGateways)

  return futurepornExclusiveGateways.concat(publicGateways)
};
