import { 
    getRealtime,
    getPushServiceAuth,
    getCsrfToken,
    getInitialRoomDossier,
    getViewerCount,
    getRandomNumberString,
    getRandomRoom,
    getRoomId
} from '../../src/chaturbate.js';
import chai, { expect } from "chai";
import { EventEmitter } from "node:events";
import chaiEvents from 'chai-events'


chai.use(chaiEvents);


describe('chaturbate', function () {
    beforeEach(function (done) {
        // courtesy delay
        setTimeout(function(){
            done();
        }, 1000);
    });

    describe('getRandomRoom', function () {
        it('should resolve with a name', async function () {
            const room = await getRandomRoom()
            expect(room).to.exist
            expect(typeof room).to.equal('string')
        })
    })
    describe('getRoomId', function () {
        it('should accept a room name and resolve with an ID', async function () {
            const id = await getRoomId('projektmelody')
            expect(id).to.equal('G0TWFS5')
        })
    })

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
    xdescribe('getRealtime', function () {
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
    describe('getPushServiceAuth', function () {
        it('should get auth data', async function () {
            const token = await getCsrfToken()
            const auth = await getPushServiceAuth(token)
            expect(typeof(auth) === 'object').to.be.true
            expect(auth).to.have.property('channels')
            expect(auth).to.have.property('token_request')
        })
    })
    describe('getRealtime', function () {
        this.timeout(60*1000)
        it('should get token for realtime platform', async function () {


            // const roomName = await getRandomRoom()
            const roomName = 'silvess333'
            const roomId = await getRoomId(roomName)
            const token = await getCsrfToken()
            console.log(`roomName:${roomName}, id:${roomId}`)

            const auth = await getPushServiceAuth(token, roomName, roomId)
            expect(auth).to.have.property('token_request')
            expect(auth.token_request).to.have.property('ttl')
            expect(auth.token_request).to.have.property('capability')
            expect(auth.token_request.capability).to.have.string(roomId)

            expect(auth.channels).to.have.property(`RoomTipAlertTopic#RoomTipAlertTopic:${roomId}`)


            const statusChannelString = auth.channels[`RoomStatusTopic#RoomStatusTopic:${roomId}`]
            const titleChannelString = auth.channels[`RoomTitleChangeTopic#RoomTitleChangeTopic:${roomId}`]
            const updateChannelString = auth.channels[`RoomUpdateTopic#RoomUpdateTopic:${roomId}`]
            const presenseChannelString = auth.channels[`RoomAnonPresenceTopic#RoomAnonPresenceTopic:${roomId}`]

            console.log(auth)

            const realtime = await getRealtime(token, auth.token_request, auth.settings.realtime_host, auth.settings.fallback_hosts)

            await realtime.connect()

            console.log('expecting a connected emission here ---v')
            expect(realtime.connection).to.emit('connected')

            realtime.connection.once('connected', (idk) => {
                console.log(`  [*] connected! ${JSON.stringify(idk, 0, 2)}`)
            })

            // const channel = realtime.channels.get(`room:notice:${roomId}`);
            // const channel = realtime.channels.get(`room:message:${roomId}:0`);
            const titleChannel = realtime.channels.get(titleChannelString);
            const updateChannel = realtime.channels.get(updateChannelString);
            const presenceChannel = realtime.channels.get(presenseChannelString);
            const statusChannel = realtime.channels.get(statusChannelString);
            statusChannel.subscribe((message) => {
                console.log(`Received room:status:<roomId>:0`)
                console.log(JSON.stringify(message, 0, 2));
            });
            titleChannel.subscribe((message) => {
                console.log(`Received room:title_change:<roomId>`)
                console.log(JSON.stringify(message, 0, 2));
            });
            updateChannel.subscribe((message) => {
                console.log(`Received room:update:<roomId>`)
                console.log(JSON.stringify(message, 0, 2));
                
            });
            presenceChannel.subscribe((message) => {
                console.log(`Received room_anon:presence:<roomId>:0`)
                console.log(JSON.stringify(message, 0, 2));
            })
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
