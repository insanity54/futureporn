import { 
    requestRealtimeToken,
    pushServiceAuth,
    getCsrfToken,
    getRealtime,
    getInitialRoomDossier,
    getViewerCount,
    getRandomNumberString,
} from '../src/chaturbate.js';
import chai, { expect } from "chai";
import chaiEvents from 'chai-events'
import { EventEmitter } from "node:events";

chai.use(chaiEvents);


describe('chaturbate', function () {
    describe('getInitialDossier', function () {
        it('should return a js object', async function () {
            const dossier = await getInitialRoomDossier()
            expect(dossier).to.have.property('wschat_host')
        });
    })
    describe('getViewerCount', function () {
        it('should return a number', async function () {
            const count = await getViewerCount()
            expect(typeof(count) === 'number').to.be.true
        })
    })
    describe('getRealtime', function () {
        it('should get an event emitter or something idk', async function () {
            const rt = await getRealtime();
            expect(rt).to.be.instanceof(EventEmitter)
        })
    })
    describe('getCsrfToken', function () {
        it('should get a token from CB', async function () {
            const token = await getCsrfToken()
            expect(typeof(token) === 'string').to.be.true
            expect(token.length).to.equal(64)
        })
    })
    describe('pushServiceAuth', function () {
        it('should get auth data', async function () {
            const token = await getCsrfToken()
            // const auth = await pushServiceAuth(token)
            expect(typeof(auth) === 'object').to.be.true
            expect(auth).to.have.property('channels')
            expect(auth).to.have.property('token_request')
        })
    })
    describe('requestRealtimeToken', function () {
        this.timeout(60*1000)
        it('should get token for realtime platform', async function () {
            const seon_mi_id = '6B0VZ8L'
            const token = await getCsrfToken()


            const auth = await pushServiceAuth(token, 'seon_mi', seon_mi_id)
            expect(auth).to.have.property('token_request')
            expect(auth.token_request).to.have.property('ttl')
            expect(auth.token_request).to.have.property('capability')
            expect(auth.token_request.capability).to.have.string(seon_mi_id)
            // expect(auth.token_request.includes('')).to.be.true

            // requestRealtimeToken(csrfToken, tokenRequest, realtimeHost, fallbackHosts) 
            // const token = csrfToken
            // const auth = await pushServiceAuth(csrfToken, roomName, roomUid);
            // const { keyName, ttl, nonce, capability, timestamp, mac } = auth.token_request;
            // const { realtime_host, fallback_hosts } = auth.settings;
            // const { client_id } = auth;


            const realtime = await requestRealtimeToken(token, auth.token_request, auth.settings.realtime_host, auth.settings.fallback_hosts)


            console.log(realtime)

            await realtime.connect()


            console.log('expecting a connected emission here ---v')
            expect(realtime.connection).to.emit('connected')
            // console.log(realtime)
            // console.log(realtime.connection)

            realtime.connection.once('connected', (idk) => {
                console.log(`  [*] connected! ${JSON.stringify(idk, 0, 2)}`)
            })

            const channel = realtime.channels.get(`room:notice:${seon_mi_id}`);
            channel.subscribe((message) => {
                console.log(`Received: ${JSON.stringify(message, 0, 2)}`);
            });

        })
    })
    describe('getRandomNumberString', function() {
        it('should return a 16 digit number', function () {
            expect(getRandomNumberString(16)).to.be.lengthOf(16)
        })
        it('should return a 1 digit number', function () {
            expect(getRandomNumberString(1)).to.be.lengthOf(1)
        })
    })
})


