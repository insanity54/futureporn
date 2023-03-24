import * as dotenv from 'dotenv'
import fastify$0 from "fastify";
import oauthPlugin from "@fastify/oauth2";
dotenv.config()

const fastify = fastify$0({ logger: { level: 'trace' } });


fastify.register(oauthPlugin, {
  name: 'patreonOAuth2',
  scope: ['identity.memberships'],
  credentials: {
    client: {
      id: process.env.PATREON_CLIENT_ID,
      secret: process.env.PATREON_CLIENT_SECRET
    },
    auth: {
      authorizeHost: 'https://www.patreon.com',
      authorizePath: '/oauth2/authorize',
      tokenHost: 'https://www.patreon.com',
      tokenPath: '/api/oauth2/token'
    }
  },
  // register a fastify url to start the redirect flow
  startRedirectPath: '/login/patreon',
  // patreon redirect here after the user login
  callbackUri: 'https://rmz78y.tunnel.pyjam.as/login/patreon/callback'
})

fastify.get('/login/patreon/callback', async function (request, reply) {
  const { token } = await this.patreonOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)

  console.log(token.access_token)

  // if later you need to refresh the token you can use
  // const { token: newToken } = await this.getNewAccessTokenUsingRefreshToken(token.refresh_token)

  reply.send({ access_token: token.access_token })

  // 
})

fastify.get('/', (req, rep) => {
  rep.type('text/html')
  rep.send(`<p><a href="/login/patreon">Login with Patreon</a></p>`)
})

fastify.listen({
  port: process.env.PORT || 3000,
  host: '0.0.0.0'
})

