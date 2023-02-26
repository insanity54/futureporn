/**
 * 
 * patreon.js
 * 
 * Gets data from Patreon
 * 
 *   - list of active CJ_Clippy patrons
 *   - list of CJ_Clippy campaign goals
 * 
 */

// describe('OAuth1.0',function(){
//   var OAuth = require('oauth');

//   it('tests trends Twitter API v1.1',function(done) {
//     var oauth = new OAuth.OAuth(
//       'https://api.twitter.com/oauth/request_token',
//       'https://api.twitter.com/oauth/access_token',
//       'your application consumer key',
//       'your application secret',
//       '1.0A',
//       null,
//       'HMAC-SHA1'
//     );
//     oauth.get(
//       'https://api.twitter.com/1.1/trends/place.json?id=23424977',
//       'your user token for this app', //test user token
//       'your user secret for this app', //test user secret            
//       function (e, data, res){
//         if (e) console.error(e);        
//         console.log(require('util').inspect(data));
//         done();      
//       });    
//   });
// });

require('dotenv').config()
const { oauth } = require('patreon')
// const OAuth = require('oauth')
const { format: formatUrl } = require('url')
const fsp = require('fs/promises')
const os = require('node:os')
const path = require('node:path')
// const fetch = require('node-fetch')
const EleventyFetch = require('@11ty/eleventy-fetch')
const redacted = require('./redacted.json')


const benefitId = 9380665 // Username displayed on Futureporn.net benefit
const campaignId = 8012692 // CJ_Clippy campaign
const dataDir = path.join(os.homedir(), '.local/share/futureporn/builder')
const tokenFile = path.join(dataDir, 'patreonTokens.json')



const { PATREON_CLIENT_ID, PATREON_CLIENT_SECRET, NGROK_TOKEN } = process.env

if (typeof PATREON_CLIENT_ID === 'undefined') throw new Error('PATREON_CLIENT_ID must be defined in env, but it was undefined.');
if (typeof PATREON_CLIENT_SECRET === 'undefined') throw new Error('PATREON_CLIENT_SECRET must be defined in env, but it was undefined.');
if (typeof NGROK_TOKEN === 'undefined') throw new Error('NGROK_TOKEN must be defined in env, but it was undefined');



function loadOauthTokenFromDisk () {
  let tokens;
  try {
    tokens = require(tokenFile)
  } catch(e) {
    console.error('error while loading oauth token from disk')
    console.error(e)
    tokens = {}
  }
  return tokens
}

async function saveOauthTokenToDisk (token) {
  return fsp.writeFile(tokenFile, JSON.stringify(token, 0, 2), { encoding: 'utf-8' })
}

async function getPatronData (access_token) {
  try {

    // // const url = `https://www.patreon.com/api/oauth2/v2/campaigns/${campaignID}/members?include=benefits&fields[member]=full_name,patron_status&fields[tier]=title,benefits&fields[benefit]=title&fields[reward]=title,amount_cents`;
    // // find the list of tiers
    // let tierData = EleventyFetch(
    //   encodeURI(`https://www.patreon.com/api/oauth2/v2/campaigns/${campaignId}/tier`),
    //   {
    //     duration: '1d',
    //     type: 'json',
    //     fetchOptions: {
    //       headers: {
    //         Authorization: `Bearer ${access_token}`
    //       }
    //     }
    //   }
    // )

    // // filter the list of tiers, showing only tiers with the "Your username displayed on Futureporn.net" benefit
    // let applicableTiers = tierData.filter((td) => td.some(td.relationships))


    let data = await EleventyFetch(
      encodeURI(`https://www.patreon.com/api/oauth2/v2/campaigns/${campaignId}/members?include=user,currently_entitled_tiers,currently_entitled_tiers.benefits&fields[tier]=title&fields[benefit]=title&fields[user]=image_url,full_name&fields[member]=full_name,lifetime_support_cents,currently_entitled_amount_cents,patron_status`), 
      {
        duration: '1d',
        type: 'json',
        fetchOptions: {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        }
      }
    );

    console.log(JSON.stringify(data, 0, 2))
    console.log('---')
    // process.exit()
    return data

  } catch (e) {
    console.error('error while fetching patron data')
    console.error(e)
  }
}

async function getGoalData (access_token) {
  try {
    const data = await EleventyFetch('https://www.patreon.com/api/oauth2/v2/campaigns/8012692?include=goals&fields%5Bgoal%5D=title,amount_cents,completed_percentage,description', {
      duration: '1d',
      type: 'json',
      fetchOptions: {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
      }
    })
    return data
  } catch (e) {
    console.error('error while fetching goal data')
    console.error(e)
  }
}


async function getAccessToken (refresh = false) {


  const loadedToken = loadOauthTokenFromDisk()

  // console.log(`loadedToken is as follows`)
  // console.log(loadedToken)
  if (loadedToken?.access_token === undefined) throw new Error('loadedToken.access_token was undefined');
  if (loadedToken?.refresh_token === undefined) throw new Error('loadedToken.refresh_token was undefined');

  // if not requested, we return the access_token on disk
  // otherwise, we refresh the token via Patreon
  if (!refresh) return loadedToken.access_token;

  console.log('>> Refreshing the OAuth access token.')

  const oauthClient = oauth(PATREON_CLIENT_ID, PATREON_CLIENT_SECRET)
  const refreshedToken = await oauthClient.refreshToken(loadedToken.refresh_token)

  const { access_token } = refreshedToken

  // save to disk
  await saveOauthTokenToDisk(refreshedToken)

  return access_token
}


/**
 * init
 * 
 * ensure data dir exists
 */
async function init () {
  await fsp.mkdir(dataDir, { recursive: true })
}

function parsePatronData (data) {



  // patreon api is kind of funky because 
  // the member is separate from the user
  // there is data I need in both the member and user objects.
  // I need to join the member and user data to get one complete object
  // which describes the patron

  // greets ChatGPT
  // Create a map of users keyed by their ID
  const users = new Map(data.included.map(user => [user.id, user.attributes]));

  // Merge member data with corresponding user data
  const mergedData = data.data.map(member => {
    const user = users.get(member.relationships.user.data.id);
    return {
      ...member,
      attributes: {
        ...member.attributes,
        ...user
      },
      type: 'futureporn_member_user'
    };
  });

  console.log(JSON.stringify(data, 0, 2));

  // we need to map benefits to tiers because users/members only have a tiers relationship (no benefits relationship)
  // so we need to know the tiers that contain the "Your username displayed on Futureporn.net" benefit
  // and include only the patrons who belong to said tiers
  const tiers = data.included.filter((d) => d.type === 'tier')
  const appropriateTiers = tiers.filter((t) => t.relationships.benefits.data.some((b) => b.id == benefitId))
  const appropriateTierIds = appropriateTiers.map((t) => t.id)


  // Greets ChatGPT
  function isPatronEntitledToAnyTier(patron) {
    const entitledTierIds = patron.relationships.currently_entitled_tiers.data.map(tier => tier.id);
    return entitledTierIds.some(tierId => appropriateTierIds.includes(tierId))
  }

  const eligiblePatrons = mergedData.filter(isPatronEntitledToAnyTier);

  // @todo remove this redaction code once it's more established that there is a privacy-focused tier
  const redactedPatrons = eligiblePatrons.filter((patron) => !redacted.includes(patron.attributes.full_name))

  const sortedPatrons = redactedPatrons.filter(patron => patron.attributes.lifetime_support_cents > 0).sort((patronA, patronB) => patronA.lifetime_support_cents - patronB.lifetime_support_cents)
  
  const activePatrons = sortedPatrons.filter(patron => patron.attributes.patron_status === 'active_patron')

  return {
    all: sortedPatrons,
    active: activePatrons
  }
}

function parseGoalsData (data) {
  const allGoals = data.included.map((goal) => goal.attributes).sort((a, b) => b.completed_percentage - a.completed_percentage)
  console.log(allGoals)
  const incompleteGoals = allGoals.filter((goal) => goal.completed_percentage < 100)
  const completeGoals = allGoals.filter((goal) => goal.completed_percentage === 100)
  return {
    all: allGoals,
    complete: completeGoals,
    incomplete: incompleteGoals
  }
}



module.exports = async function() {
  await init()
  let patronData, goalData, access_token
  access_token = await getAccessToken(false)

  // get data from patreon.
  // if there is any error, get a new oauth token.
  try {
    patronData = await getPatronData(access_token)
    goalData = await getGoalData(access_token)
  } catch (e) {
    console.error('error during patreon.cjs main functino ')
    console.error(e)

    access_token = await getAccessToken(true)
    patronData = await getPatronData(access_token)
    goalData = await getGoalData(access_token)
  }

  const patrons = parsePatronData(patronData)
  const goals = parseGoalsData(goalData)

  // console.log(patrons.active)
  return { patrons, goals }
};