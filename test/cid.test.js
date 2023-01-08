
const chai = require('chai');

const { convertToV1, isCidV0 } = require('../utils/cid.js')


const cidV0Fixture = "QmTYN7LXsTU3WV2cUndqK32Bd98TEiGqV2UgDQAfmYsU72"
const cidV1Fixture = "bafybeicnjkrkbkhfyllhvoo5vx2wwxbld2ecqqjhv22o7lv3zob5jgulne"
const cidV1FixtureWithPath = "bafybeicnjkrkbkhfyllhvoo5vx2wwxbld2ecqqjhv22o7lv3zob5jgulne?filename=20201011T220530Z-thicc.jpg"
const cidV0FixtureWithPath = "QmTYN7LXsTU3WV2cUndqK32Bd98TEiGqV2UgDQAfmYsU72?filename=20201011T220530Z-thicc.jpg"

describe('convertToV1', function () {
    it('should convert a v0 to v1', async function() {
        const v1 = await convertToV1(cidV0Fixture)
        chai.expect(v1).to.equal(cidV1Fixture)
    })
    it('should handle a cid with a querystring', async function () {
        const v1 = await convertToV1(cidV0FixtureWithPath)
        chai.expect(v1).to.equal(cidV1FixtureWithPath)
    })
})


describe('isCidV0', function() {
    it('should return true when the CID is v0', function () {
        chai.expect(isCidV0(cidV0Fixture)).to.be.true
    })
    it('should handle a v0 CID with querystring', function () {
        chai.expect(isCidV0(cidV0FixtureWithPath)).to.be.true
    })
    it('should return false when teh CID is v1', function () {
        chai.expect(isCidV0(cidV1Fixture)).to.be.false
    })
    it('should handle a v1 CID with querystring', function () {
        chai.expect(isCidV0(cidV1FixtureWithPath)).to.be.false
    })
})