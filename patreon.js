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
const { oauth, patreon } = require('patreon');
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

    // mimic a database
    let database = {}


    const loginUrl = formatUrl({
        protocol: 'https',
        host: 'patreon.com',
        pathname: '/oauth2/authorize',
        query: {
            response_type: 'code',
            client_id: PATREON_CLIENT_ID,
            redirect_uri: redirect,
            state: 'bing-chilling',
            scopes: 'users pledges-to-me my-campaign'
        }
    })
    open(loginUrl)


    app.get('/oauth/callback', (req, res) => {
        const { code } = req.query
        let token

        return oauthClient.getTokens(code, redirect)
            .then(({ access_token }) => {
                token = access_token // eslint-disable-line camelcase
                const apiClient = patreon(token)
                return apiClient('/campaigns/8012692/pledges')
            })
            .then(async ({ rawJson }) => {

                const pledges = rawJson.included
                    .filter(p => p.type === 'user')
                    .filter(p => p.attributes.first_name !== '@CJ_Clippy')
                    .map(p => p.attributes.first_name)


                const metadata = require(metadataFile);

                const patchedMetadata = Object.assign({}, metadata, { patrons: pledges });


                await fsp.writeFile(metadataFile, JSON.stringify(patchedMetadata, 0, 2), { encoding: 'utf-8' });

                return res.redirect(`/done`)
            })
            .catch((err) => {
                console.log(err)
                console.log('Error! Redirecting to login')
                res.redirect('/')
            })
    })


    app.get('/done', (req, res) => {
        res.send('OK');
        process.exit();
    })
    app.listen(port, () => {
        console.log(`Listening on http://localhost:${port}`);
    })


})()