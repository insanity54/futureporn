/**
 * 
 * patreon.js
 * 
 * Gets a list of active patrons and puts them on https://futureporn.net/patrons/
 * 
 * 
 * 
 */


require('dotenv').config()
const { oauth } = require('patreon');
const ngrok = require('ngrok');
const express = require('express');
const { format: formatUrl } = require('url');
const fsp = require('fs/promises');
const open = require('open');

const app = express()


const port = 8000;
const redirect = 'https://futureporn.ngrok.io/oauth/callback'
const metadataFile = './website/_data/metadata.json';

const { PATREON_CLIENT_ID, PATREON_CLIENT_SECRET, NGROK_TOKEN } = process.env

if (typeof PATREON_CLIENT_ID === 'undefined') throw new Error('PATREON_CLIENT_ID must be defined in env, but it was undefined.');
if (typeof PATREON_CLIENT_SECRET === 'undefined') throw new Error('PATREON_CLIENT_SECRET must be defined in env, but it was undefined.');
if (typeof NGROK_TOKEN === 'undefined') throw new Error('NGROK_TOKEN must be defined in env, but it was undefined');

// greets https://stackoverflow.com/a/1349426/1004931
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function sleep (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}



(async () => {



    await ngrok.connect({
      proto: 'http', // http|tcp|tls, defaults to http
      addr: port, // port or network address, defaults to 80
      subdomain: 'futureporn', // reserved tunnel name https://alex.ngrok.io
      authtoken: NGROK_TOKEN, // your authtoken from ngrok.com
      region: 'us', // one of ngrok regions (us, eu, au, ap, sa, jp, in), defaults to us
      onStatusChange: status => console.log, // 'closed' - connection is lost, 'connected' - reconnected
      onLogEvent: data => console.log, // returns stdout messages from ngrok process
    });


    const oauthClient = oauth(PATREON_CLIENT_ID, PATREON_CLIENT_SECRET)


    const loginUrl = formatUrl({
        protocol: 'https',
        host: 'patreon.com',
        pathname: '/oauth2/authorize',
        query: {
            response_type: 'code',
            client_id: PATREON_CLIENT_ID,
            redirect_uri: redirect,
            state: makeid(14),
            scopes: 'identity identity.memberships campaigns campaigns.members campaigns.members[email] campaigns.members.address'
        }
    })
    open(loginUrl);


    app.get('/oauth/callback', async (req, res) => {
        const { code } = req.query

        try {

            const tokens = await oauthClient.getTokens(code, redirect)
            // .then(({ access_token }) => {
                // token = access_token // eslint-disable-line camelcase
                // const apiClient = patreon(token)
                // return apiClient('/campaigns/8012692/pledges')
                // return apiClient('')

            const {default: got} = await import('got');

            const access_token = tokens?.access_token

            console.log(`access_token:${access_token}`)

            if (typeof access_token === 'undefined') throw new Error('did not see tokens.access token from the Patreon via the oauth client')

            const { data } = await got({
                url: encodeURI('https://www.patreon.com/api/oauth2/v2/campaigns/8012692/members?include=currently_entitled_tiers&fields[member]=full_name,lifetime_support_cents,currently_entitled_amount_cents,patron_status'),
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }).json()
            

            console.log('here is the data')
            // console.log(data)
            console.log(JSON.stringify(data, 0, 2))
            console.log('----')
            const metadata = require(metadataFile);

            const stortedPatrons = data.sort((patronA, patronB) => patronA.lifetime_support_cents - patronB.lifetime_support_cents)
            const allPatronNames = stortedPatrons.map(patron => patron.attributes.full_name).concat(metadata.donors);
            const activePatronNames = stortedPatrons.filter(patron => patron.attributes.patron_status === 'active_patron').map(patron => patron.attributes.full_name);
            // const currentSupportCents = data.reduce((acc, patron) => acc + patron.attributes.currently_entitled_amount_cents, 0)

            console.log('here are all patrons');
            console.log(allPatronNames);
            console.log('----')
            console.log('here are active patrons')
            console.log(activePatronNames)
            // console.log(`current total support cents-- ${currentSupportCents} ($${currentSupportCents/100})`)


            const response = await got({
                url: 'https://www.patreon.com/api/oauth2/v2/campaigns/8012692?include=goals&fields%5Bgoal%5D=title,amount_cents,completed_percentage,description',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }).json()


            console.log('here is the campaign data')
            console.log(JSON.stringify(response, 0, 2))

            const goals = response.included.map((goal) => goal.attributes)
            const incompleteGoals = goals.filter((goal) => goal.completed_percentage < 100)



            const patchedMetadata = Object.assign({}, metadata, { activePatronNames, allPatronNames, goals, incompleteGoals });


            await fsp.writeFile(metadataFile, JSON.stringify(patchedMetadata, 0, 2), { encoding: 'utf-8' });

            return res.redirect(`/done`)

        } catch (err) {
            console.log(err)
            console.log('Error!')
            res.redirect('/error')
        }
        
    })

    app.get('/error', (req, res) => {
        res.send('There was an error. please check the logs.')
        process.exit(1)
    })

    app.get('/done', (req, res) => {
        res.send('OK');
        process.exit(0);
    })
    app.listen(port, () => {
        console.log(`Listening on http://localhost:${port}`);
    })


})()