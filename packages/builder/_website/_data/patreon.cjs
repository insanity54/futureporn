/**
 * 
 * patreon.js
 * 
 * Gets data from Patreon
 * 
 *   - list of active CJ_Clippy patrons
 *   - list of CJ_Clippy campaign goals
 * 
 * 
 * 
 * DEPRECATED
 * 
 * API calls to patreon require Oauth access token & refresh token. 
 * These require state on the build server which is unsupported on Fleek rn.
 * 
 */




require('dotenv').config()
// const { oauth } = require('patreon')
// // const OAuth = require('oauth')
// const { format: formatUrl } = require('url')
// const fsp = require('fs/promises')
// const os = require('node:os')
// const path = require('node:path')
const fetch = require('node-fetch')
const EleventyFetch = require('@11ty/eleventy-fetch')
// // const redacted = require('./redacted.json')


// const benefitId = 9380665 // Username displayed on Futureporn.net benefit
// const campaignId = 8012692 // CJ_Clippy campaign
// const dataDir = path.join(os.homedir(), '.local/share/futureporn/builder')
// const tokenFile = path.join(dataDir, 'patreonTokens.json')



new Array(
  'PATREON_ACCESS_TOKEN',
  'PATREON_REFRESH_TOKEN',
  'PATREON_CLIENT_ID',
  'PATREON_CLIENT_SECRET',
).forEach((ev) => { 
  if (typeof process.env[ev] === 'undefined') throw new Error(`${ev} is undefined in env`) 
})




// function loadOauthTokenFromDisk () {
//   let tokens;
//   try {
//     tokens = require(tokenFile)
//   } catch(e) {
//     console.error('error while loading oauth token from disk')
//     console.error(e)
//     tokens = {}
//   }
//   return tokens
// }

// async function saveOauthTokenToDisk (token) {
//   return fsp.writeFile(tokenFile, JSON.stringify(token, 0, 2), { encoding: 'utf-8' })
// }

//     // console.log(JSON.stringify(data, 0, 2))
//     // console.log('---')
//     // process.exit()
//     return data

//   } catch (e) {
//     console.error('error while fetching patron data')
//     console.error(e)
//   }
// }



// async function getAccessToken (refresh = false) {


//   const loadedToken = loadOauthTokenFromDisk()

//   // console.log(`loadedToken is as follows`)
//   // console.log(loadedToken)
//   if (loadedToken?.access_token === undefined) throw new Error('loadedToken.access_token was undefined');
//   if (loadedToken?.refresh_token === undefined) throw new Error('loadedToken.refresh_token was undefined');

//   // if not requested, we return the access_token on disk
//   // otherwise, we refresh the token via Patreon
//   if (!refresh) return loadedToken.access_token;

//   console.log('>> Refreshing the OAuth access token.')

//   const oauthClient = oauth(PATREON_CLIENT_ID, PATREON_CLIENT_SECRET)
//   const refreshedToken = await oauthClient.refreshToken(loadedToken.refresh_token)

//   const { access_token } = refreshedToken

//   // save to disk
//   await saveOauthTokenToDisk(refreshedToken)

//   return access_token
// }


// /**
//  * init
//  * 
//  * ensure data dir exists
//  */
// async function init () {
//   await fsp.mkdir(dataDir, { recursive: true })
// }

// function parsePatronData (data) {



//   // patreon api is kind of funky because 
//   // the member is separate from the user
//   // there is data I need in both the member and user objects.
//   // I need to join the member and user data to get one complete object
//   // which describes the patron

//   // greets ChatGPT
//   // Create a map of users keyed by their ID
//   const users = new Map(data.included.map(user => [user.id, user.attributes]));

//   // Merge member data with corresponding user data
//   const mergedData = data.data.map(member => {
//     const user = users.get(member.relationships.user.data.id);
//     return {
//       ...member,
//       attributes: {
//         ...member.attributes,
//         ...user
//       },
//       type: 'futureporn_member_user'
//     };
//   });

//   // console.log(JSON.stringify(data, 0, 2));

//   // we need to map benefits to tiers because users/members only have a tiers relationship (no benefits relationship)
//   // so we need to know the tiers that contain the "Your username displayed on Futureporn.net" benefit
//   // and include only the patrons who belong to said tiers
//   const tiers = data.included.filter((d) => d.type === 'tier')
//   const appropriateTiers = tiers.filter((t) => t.relationships.benefits.data.some((b) => b.id == benefitId))
//   const appropriateTierIds = appropriateTiers.map((t) => t.id)


//   // Greets ChatGPT
//   function isPatronEntitledToAnyTier(patron) {
//     const entitledTierIds = patron.relationships.currently_entitled_tiers.data.map(tier => tier.id);
//     return entitledTierIds.some(tierId => appropriateTierIds.includes(tierId))
//   }

//   const eligiblePatrons = mergedData.filter(isPatronEntitledToAnyTier);

//   // @todo remove this redaction code once it's more established that there is a privacy-focused tier
//   // const redactedPatrons = eligiblePatrons.filter((patron) => !redacted.includes(patron.attributes.full_name))

//   const sortedPatrons = eligiblePatrons.filter(patron => patron.attributes.lifetime_support_cents > 0).sort((patronA, patronB) => patronA.lifetime_support_cents - patronB.lifetime_support_cents)
  
//   const activePatrons = sortedPatrons.filter(patron => patron.attributes.patron_status === 'active_patron')

//   return {
//     all: sortedPatrons,
//     active: activePatrons
//   }
// }

// function parseGoalsData (data) {
//   const allGoals = data.included.map((goal) => goal.attributes).sort((a, b) => b.completed_percentage - a.completed_percentage)
//   // console.log(allGoals)
//   const incompleteGoals = allGoals.filter((goal) => goal.completed_percentage < 100)
//   const completeGoals = allGoals.filter((goal) => goal.completed_percentage === 100)
//   return {
//     all: allGoals,
//     complete: completeGoals,
//     incomplete: incompleteGoals
//   }
// }


async function getAccessToken () {
  return process.env.PATREON_ACCESS_TOKEN
}


async function refreshAccessToken (refresh_token) {
  console.log(`  refreshing access token.`)
  const res = await fetch(
    encodeURI(
      'www.patreon.com/api/oauth2/token'
      + `?grant_type=refresh_token`
      + `&refresh_token=${refresh_token}`
      + `&client_id=${process.env.PATREON_CLIENT_ID}`
      + `&client_secret=${process.env.PATREON_CLIENT_SECRET}`
    )
  )
}

async function getPatreonData (access_token, attempts = 1) {
  try {
    let patronData = await EleventyFetch(
      encodeURI(`https://www.patreon.com/api/oauth2/v2/campaigns/${campaignId}/members?include=user,currently_entitled_tiers,currently_entitled_tiers.benefits&fields[tier]=title&fields[benefit]=title&fields[user]=image_url,full_name&fields[member]=full_name,lifetime_support_cents,currently_entitled_amount_cents,patron_status`), 
      {
        duration: '5m',
        type: 'json',
        fetchOptions: {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        }
      }
    );
    const goalData = await EleventyFetch('https://www.patreon.com/api/oauth2/v2/campaigns/8012692?include=goals&fields%5Bgoal%5D=title,amount_cents,completed_percentage,description', {
      duration: '1d',
      type: 'json',
      fetchOptions: {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    })
    return {
      patronData,
      goalData
    }
  } catch (e) {
    console.error(e)
    console.error(`  Attempt ${attempts} failed getting patreon data. trying again.`)
    let access_token = await refreshAccessToken(process.env.PATREON_REFRESH_TOKEN)
    return getPatreonData(access_token, attempts+1)
  }
}

module.exports = async function() {
  // let patronData, goalData, access_token
  // access_token = await getAccessToken()

  // // get data from patreon.
  // // if there is any error, get a new oauth token.
  // try {

  //   let { patronData, goalData } = await getPatronData(access_token)
  //   goalData = await getGoalData(access_token)
  // } catch (e) {
  //   console.error('error during patreon.cjs main functino. lets get a new access_token from Patreon.')
  //   console.error(e)

  //   access_token = await getAccessToken(true)
  //   patronData = await getPatronData(access_token)
  //   goalData = await getGoalData(access_token)
  // }

  // const patrons = parsePatronData(patronData)
  // const goals = parseGoalsData(goalData)

  // console.log(patrons.active)


  // temporary disable
  let patrons = {
    active: [],
    all: []
  }
  let goals = {
    complete: []
  }
  return { patrons, goals }
};