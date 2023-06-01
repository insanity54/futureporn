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

const fetch = require('node-fetch')
const EleventyFetch = require('@11ty/eleventy-fetch')




new Array(
  'STRAPI_URL',
  'STRAPI_API_KEY'
).forEach((ev) => { 
  if (typeof process.env[ev] === 'undefined') throw new Error(`${ev} is undefined in env`) 
})


async function getPublicPatrons () {
  const res = await fetch(`${process.env.STRAPI_URL}/api/users`, {
    headers: {
      'Authorization': `Bearer ${process.env.STRAPI_API_KEY}`
    }
  })
  const data = await res.json()
}




async function getPatreonData (accessToken, campaignId, attempts = 1) {
  try {
    let patreonData = await EleventyFetch(
      encodeURI(`https://www.patreon.com/api/oauth2/v2/campaigns/${campaignId}`), 
      {
        duration: '5m',
        type: 'json',
        fetchOptions: {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      }
    );
    return patreonData
  } catch (e) {
    console.error(e)
    console.error(`  Attempt ${attempts} failed getting patreon data. trying again.`)
    let accessToken = await refreshAccessToken(process.env.PATREON_REFRESH_TOKEN)
    return getPatreonData(accessToken, campaignId, attempts+1)
  }
}



module.exports = async function() {

  console.log(`lets get patreon campaign data`)  
  const campaignData = await EleventyFetch('https://www.patreon.com/api/campaigns/8012692', {
    duration: "1d",
    type: "json"
  })


  const patronsUrl = `${process.env.STRAPI_URL}/api/patreon/patrons`
  console.log(`lets get public patron list from ${patronsUrl}`)
  const patrons = await EleventyFetch(patronsUrl, {
    duration: "1m",
    type: "json",
    fetchOptions: {
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_API_KEY}`
      }
    }
  })

  const muxAllocationCount = await EleventyFetch(`${process.env.STRAPI_URL}/api/patreon/muxAllocationCount`, {
    duration: '1m',
    type: 'json',
    fetchOptions: {
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_API_KEY}`
      }
    }
  })


  const pledgeSum = campaignData?.data?.attributes?.pledge_sum
  const patronCount = campaignData?.data?.attributes?.patron_count

  console.log(`pledgeSum:${pledgeSum}`)

  // Patreon is removing goals from their API so we are hard-coding them here.
  let allGoals = [
    {
      name: 'Operating Cost',
      amount_cents: 13000,
      description: 'This goal would cover my minimum operating cost of Futureporn.net.',
    },
    {
      name: 'Tags',
      amount_cents: 18000,
      description: 'This goal would fund development of a tagging feature.'
    },
    {
      name: 'Orgy',
      amount_cents: 40000,
      description: 'Storage/bandwidth funding for more LewdTubers'
    },
    {
      name: 'FeelsGoodMan',
      amount_cents: 50000,
      description: 'This goal would fund Futureporn vibrator integration.'
    },
  ]

  let allGoalsSorted = allGoals
    .map((g) => {
      g.completed_percentage = Math.min(100, Math.round(pledgeSum / g.amount_cents / 0.01))
      return g
    })
    .sort((ga, gb) => ga.amount_cents-gb.amount_cents)

  let goals = {}
  goals.complete = allGoalsSorted.filter((g) => g.amount_cents < pledgeSum)
  goals.incomplete = allGoalsSorted.filter((g) => g.amount_cents > pledgeSum)

  console.log(goals.complete)
  console.log(goals.incomplete)


  return { patrons, goals, patronCount, muxAllocationCount }
};
