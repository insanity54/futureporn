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

const publicGatewayNames = [
  'https://ipfs.io/ipfs/:hash',
  'https://dweb.link/ipfs/:hash',
]



module.exports = async function() {

  // I'm disabling the option to fetch the public gateways because I don't think it's useful
  // we need FAST options only, otherwise it's pointless to give the user an option
  //
  // const publicGatewayNames = await EleventyFetch('https://github.com/ipfs/public-gateway-checker/raw/master/src/gateways.json', {
  //   duration: '1w',
  //   type: 'json'
  // })

  const publicGateways = publicGatewayNames
    .map((gw) => ({ 
      pattern: gw, 
      url: gw.replace(':hash', ''), 
      hostname: new URL(gw).hostname 
    }))


  return futurepornExclusiveGateways.concat(publicGateways)
};
