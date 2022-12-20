import chai from "chai";
// import path from "path";
// import chaiAsPromised from "chai-as-promised";
import { containsCBInviteLink } from "../src/tweetProcess.js";
// chai.use(chaiAsPromised);
const sampleTweet6 = {
    entities: {
        urls: [
            {
                unwound_url: 'https://chaturbate.com/b/ProjektMelody'
            }
        ]
    }
};
const sampleTweet7 = {
    entities: {
        urls: [
            {
                unwound_url: 'https://chaturbate.com/?tour=7Bge&room=ProjektMelody&campaign=wXffl&disable_sound=0'
            }
        ]
    }
};
const sampleTweet4 = {
    entities: {
        urls: [
            {
                unwound_url: 'https://chaturbate.com/b/goldengoddessxx'
            }
        ]
    }
};
const sampleTweet5 = {
    entities: {
        urls: [
            {
                unwound_url: 'https://chaturbate.com/?tour=117e&room=goldengoddessxx&campaign=jflef&disable_sound=0'
            }
        ]
    }
};
const sampleTweet3 = {
    created_at: '2021-12-29T18:32:14.000Z',
    id: '1476259783791497217',
    author_id: '1148121315943075841',
    text: 'https://t.co/9jL6fAgMuj',
    entities: {
        urls: [
            {
                start: 0,
                end: 23,
                url: 'https://t.co/9jL6fAgMuj',
                expanded_url: 'https://twitter.com/ProjektMelody/status/1476259783791497217/photo/1',
                display_url: 'pic.twitter.com/9jL6fAgMuj'
            }
        ]
    }
};
const sampleTweet2 = {
    text: "I couldn't resist\n\nhttps://t.co/etfBuD5npl",
    id: '1478141764741611527',
    author_id: '1148121315943075841',
    created_at: '2022-01-03T23:10:33.000Z',
    entities: {
        urls: [
            {
                start: 19,
                end: 42,
                url: 'https://t.co/etfBuD5npl',
                expanded_url: 'http://bit.ly/3n71Pgv',
                display_url: 'bit.ly/3n71Pgv',
                images: [],
                status: 200,
                title: 'Chaturbate - Free Adult Live Webcams!',
                description: 'Enjoy free chat and live webcam broadcasts from amateurs around the world. No registration required!',
                unwound_url: 'https://chaturbate.com/?tour=7Bge&room=projektmelody&campaign=wXffl&disable_sound=0'
            }
        ]
    }
};
const sampleTweet1 = {
    text: "Hey guys! I'm totally ready and getting online now!!\n" +
        '\n' +
        'https://t.co/cxNMAIsNDu https://t.co/QjyJQefF1S',
    id: '1225922638687752192',
    created_at: '2020-02-07T23:21:48.000Z',
    author_id: '1148121315943075841',
    entities: {
        urls: [
            {
                start: 54,
                end: 77,
                url: 'https://t.co/cxNMAIsNDu',
                expanded_url: 'https://chaturbate.com/b/projektmelody/',
                display_url: 'chaturbate.com/b/projektmelod…',
                images: [],
                status: 200,
                title: 'Watch Projektmelody live on Chaturbate!',
                description: 'Deck my halls science team',
                unwound_url: 'https://chaturbate.com/projektmelody/'
            },
            {
                start: 78,
                end: 101,
                url: 'https://t.co/QjyJQefF1S',
                expanded_url: 'https://twitter.com/ProjektMelody/status/1225922638687752192/photo/1',
                display_url: 'pic.twitter.com/QjyJQefF1S'
            }
        ]
    }
};
describe('tweetProcess', function () {
    describe('deriveTitle', function () {
    });
    describe('containsCBInviteLink', function () {
        it('should return true with a chaturbate.com/b/ style cb link', function () {
            chai.expect(containsCBInviteLink(sampleTweet1)).to.be.true;
        });
        it('should return true with a chaturbate.com/?tour=7Bge&room=projektmelody&campaign=wXffl&disable_sound=0 style cb link', function () {
            chai.expect(containsCBInviteLink(sampleTweet2)).to.be.true;
        });
        it('should return false with a tweet lacking a chaturbate link', function () {
            chai.expect(containsCBInviteLink(sampleTweet3)).to.be.false;
        });
        it('should return false with a chaturbate.com/b/ style link to a room other than projektmelody', function () {
            chai.expect(containsCBInviteLink(sampleTweet4)).to.be.false;
        });
        it('should return false with a chaturbate.com/?(...) style link to a room other than projektmelody', function () {
            chai.expect(containsCBInviteLink(sampleTweet5)).to.be.false;
        });
        it('should be case insensitive', function () {
            chai.expect(containsCBInviteLink(sampleTweet6)).to.be.true;
            chai.expect(containsCBInviteLink(sampleTweet7)).to.be.true;
        });
    });
});
