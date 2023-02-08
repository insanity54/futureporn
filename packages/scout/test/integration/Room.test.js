
import chai, { expect } from "chai";
import { EventEmitter } from "node:events";
import chaiEvents from 'chai-events'
import Room from '../../src/Room.js'

import { projektMelodyCbRoomId } from '../../src/constants.js'

chai.use(chaiEvents);


describe('Room', function () {
    beforeEach(function (done) {
        // courtesy delay
        setTimeout(function(){
            done();
        }, 1000);
    });
    it('should get a room id', async function () {
        const room = new Room({
            roomName: 'projektmelody'
        })
        const roomId = await room.getRoomId()
        expect(roomId).to.equal(projektMelodyCbRoomId)
        expect(room).to.have.property('roomId', projektMelodyCbRoomId)
    })

    describe('getCsrfToken', function () {
        it('should get a token from CB', async function () {
            const room = new Room({
                roomName: 'projektmelody'
            })
            const token = await room.getCsrfToken()
            expect(typeof(token) === 'string').to.be.true
            expect(token.length).to.equal(64)
        })
    })

    describe('getPushServiceAuth', function () {
        it('should resolve with a valid TokenRequest', async function () {
            const room = new Room({
                roomName: 'projektmelody'
            })
            const tokenRequest = await room.getPushServiceAuth()
            expect(tokenRequest).to.have.property('token_request')
            expect(tokenRequest.token_request).to.have.property('timestamp')
            expect(tokenRequest.token_request).to.have.property('ttl')
        })
        it('should re-use the token as long as its not expired', async function () {
            const room = new Room({
                roomName: 'projektmelody'
            })
            const tokenRequest1 = await room.getPushServiceAuth()
            const tokenRequest2 = await room.getPushServiceAuth()
            expect(tokenRequest1.token).to.equal(tokenRequest2.token)
        })
    })

})