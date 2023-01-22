import { expect } from 'chai'
import { doProcessVod } from '../src/process.js'


xdescribe('process integration', function () {
    it('doProcessVod', async function () {
        const cid = await doProcessVod([
            {
                timestamp: 1,
                file: '/mock-stream0.mp4'
            }, {
                timestamp: 2,
                file: '/mock-stream1.mp4'
            }, {
                timestamp: 3,
                file: '/mock-stream2.mp4'
            }
        ])
        expect(typeof cid).to.equal('string')
    })
})