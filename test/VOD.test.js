

const expect = require('chai').expect
const VOD = require('../utils/VOD.js');
const path = require('path');
const matter = require('gray-matter');
const fsp = require('fs/promises');
const { parseISO, isEqual, isValid } = require('date-fns');

const pngFixture = path.join(__dirname, './cj_clippy_avatar.png');
const b2VODFixture = 'https://f000.backblazeb2.com/file/futureporn/projektmelody-chaturbate-2021-10-11.mp4';
const ipfsHashFixture = 'bafkreiek3g2fikcwe672ayjeab3atgpmxlyfv32clxfcu5r4xv66iz4nlm';
const annouceUrlFixture = 'https://twitter.com/ProjektMelody/status/1272965936685953024'
const thiccHashFixture = 'bafkreiek3g2fikcwe672ayjeab3atgpmxlyfv32clxfcu5r4xv66iz4nlm';

describe('VOD', () => {

    describe('getTweetIdFromAnnounceUrl', () => {
        it('should find the tweet ID', () => {
            const v = new VOD({
                announceUrl: annouceUrlFixture
            })
            expect(v.getTweetIdFromAnnounceUrl()).to.equal('1272965936685953024');
        })
    })

    describe('getDateFromTwitter', () => {
        it('should reach out to twitter and return the ISO date', async () => {
            const v = new VOD({
                announceUrl: annouceUrlFixture
            })
            await v.getDateFromTwitter();
            expect(isEqual(v.date, new Date('2020-06-16T18:55:04.000Z'))).to.be.true;
        })
    })


    describe('default', () => {
        it("should accept '' and return ''", () => {
            expect(VOD.default('')).to.equal('');
        })
        it("should accept 'yolo' and return 'yolo'", () => {
            expect(VOD.default('yolo')).to.equal('yolo');
        })
        it("should accept {Date} and return {Date}", () => {
            const d = new Date();
            expect(VOD.default(d)).to.equal(d);
        })
        it("should accept undefined and return ''", () => {
            expect(VOD.default(undefined)).to.equal('');
        })
    })

    describe('parseDate', () => {
        it('should accept {String} 2021-10-16 and return a Date', () => {
            const d = VOD.parseDate('2021-10-16');
            expect(d).to.be.an.instanceof(Date);
            expect(isValid(d)).to.be.true;
        })
        it('should accept 2021-10-16T00:00:00.000Z and return a Date', () => {
            const d = VOD.parseDate('2021-10-16T00:00:00.000Z');
            expect(d).to.be.an.instanceof(Date);
            expect(isValid(d)).to.be.true;
        })
        it("should accept '' and return ''", () => {
            const d = VOD.parseDate('');
            expect(d).to.equal('');
        })
        it("should accept undefined and return ''", () => {
            const d = VOD.parseDate(undefined);
            expect(d).to.equal('');
        })
    })

    describe('getMarkdownFilename', () => {
        it('should return an absolute path with no spaces', () => {
            const v = new VOD({
                date: '3031-10-16T00:00:00.000Z'
            })
            const res = v.getMarkdownFilename();
            expect(typeof res).to.equal('string');
            expect(res).to.match(/\/futureporn\/website\/vods\/3031-10-16T00:00:00\.000Z\.md/);
            expect(path.isAbsolute(res)).to.be.true;
        })
    })

    describe('saveMarkdown', () => {
        it('should save the vod data to disk as markdown', async () => {
            const note = 'This is not an actual VOD. This is only a test.';
            const date = '3021-10-16T00:30:00.000Z';
            const v = new VOD({
                date: date,
                videoSrcHash: b2VODFixture,
                note: note
            })
            const res = await v.saveMarkdown();
            expect(res).to.be.an.instanceof(VOD);
            const filePath = path.join(
                __dirname, 
                '..', 
                'website', 
                'vods', 
                `${date}.md`
            );
            const md = await fsp.readFile(
                filePath,
                { encoding: 'utf-8' }
            );
            const m = matter(md);
            expect(m.data).to.have.property('videoSrcHash', b2VODFixture);
            expect(m.data).to.have.property('note', note);
            expect(m.data).to.have.property('date');
            expect(m.data.date).to.be.an.instanceof(Date);
            expect(isEqual(m.data.date, parseISO(date))).to.be.true;
        })
    })

    xdescribe('downloadFromIPFS', () => {
        it('should download a file to /tmp', async () => {
            const v = new VOD({
                videoSrcHash: ipfsHashFixture
            })
            const res = await v.downloadFromIpfs(ipfsHashFixture);
            expect(res).to.have.property('filename');
            expect(res).to.have.property('execa');
            expect(res.execa).to.have.property('killed', false);
            expect(res.execa).to.have.property('exitCode', 0);
            expect(res.filename).to.equal(`/tmp/${ipfsHashFixture}`);
        })
    }, 30*1000)

    describe('getDatestamp', () => {
        it('should return a date in Zulu tz', () => {
            const v = new VOD({ date: '3021-10-16' });
            expect(v.getDatestamp()).to.equal('3021-10-16T00:00:00.000Z');
        })
    })

    describe('getVideoBasename', () => {
        it('should generate a unique filename using the date', () => {
            const v = new VOD({
                date: '3021-10-16T00:00:00.000Z'
            })
            const filename = v.getVideoBasename();
            expect(filename).to.equal('projektmelody-chaturbate-3021-10-16T00:00:00.000Z.mp4');
        })
    })

    // xdescribe('uploadToIpfs', () => {
    //  // this test is fucked due to some web3.storage issue that I can't get around
    //  // it's only a problem when invoked via jest
    //  //     Cannot find module 'ipfs-car/pack' from 'node_modules/web3.storage/dist/src/lib.cjs'
    //  it('should upload a file and save the cid to vod.videoSrcHash', async () => {
    //      const v = new VOD({
    //          tmpFilePath: path.join(__dirname, 'cj_clippy_avatar.png')
    //      })
    //      await v.uploadToIpfs();
    //      expect(v.videoSrcHash).to.equal(thiccHashFixture);
    //  })
    // })

    xdescribe('uploadToB2', () => {
        it('should upload a file to Backblaze', async () => {
            const v = new VOD({
                date: '2021-10-16',
                tmpFilePath: pngFixture
            })
            const res = await v.uploadToB2();
            expect(res).to.be.an.instanceof(VOD);
            expect(res).to.have.property('videoSrc');
            expect(res.videoSrc).to.match(/backblaze2.com\/file\/futureporn\//);
        })
    })

    describe('getSafeText', () => {
        it('should escape double quotes', () => {
            expect(VOD.getSafeText('Hello "world"')).to.match(/\\"world\\"/);
        })
    })

    describe('getTmpDownloadPath', () => {
        it('should return something like /tmp/<filename>.<extension>', () => {
            const dlPath = VOD.getTmpDownloadPath('myfile.txt');
            expect(dlPath).to.equal('/tmp/myfile.txt');
        })
    })

    describe('getMethodToEnsureDate', () => {
        it('should return {function} this.getDateFromTwitter if date is missing', () => {
            const v = new VOD({
                videoSrcHash: ipfsHashFixture
            })
            const method = v.getMethodToEnsureDate();
            expect(method).to.be.an.instanceof(Function);
        })
        it('should return null if date is present', () => {
            const v = new VOD({
                date: '3021-10-16'
            })
            const method = v.getMethodToEnsureDate();
            expect(method).to.be.null;
        })
        it('should return null if zulu date exists', () => {
            const v = new VOD({
                date: '3021-10-16T00:00:00.000Z'
            })
            const method = v.getMethodToEnsureDate();
            expect(method).to.be.null;
        })
    })

    describe('getMethodToEnsureB2', () => {
        it('should return {function} this.copyIpfsToB2 if B2 is missing', () => {
            const v = new VOD({
                videoSrc: '',
                videoSrcHash: ipfsHashFixture
            })
            const method = v.getMethodToEnsureB2();
            expect(method).to.be.an.instanceof(Function);
        })
        it('should return null if B2 exists', () => {
            const v = new VOD({
                videoSrc: b2VODFixture,
                videoSrcHash: ipfsHashFixture
            })
            const method = v.getMethodToEnsureB2();
            expect(method).to.be.null;  
        })
        it('should return null if neither videoSrc nor videoSrcHash exists', () => {
            const v = new VOD({});
            expect(v.getMethodToEnsureB2()).to.be.null;
        })
    })

    describe('getIpfsUrl', () => {
        it('should return ipfs.io url', () => {
            const date = '3021-10-16T00:00:00.000Z';
            const v = new VOD({ videoSrcHash: ipfsHashFixture, date: date });
            expect(v.getIpfsUrl()).to.equal(`https://ipfs.io/ipfs/${ipfsHashFixture}?filename=projektmelody-chaturbate-${date}.mp4`)
        })
    })

    describe('getMethodToEnsureIpfs', () => {
        it('should return {function} this.copyB2ToIpfs if ipfs is missing', () => {
            const v = new VOD({
                videoSrcHash: '',
                videoSrc: b2VODFixture
            })
            const method = v.getMethodToEnsureIpfs();
            expect(method).to.be.an.instanceof(Function);
        })
        it('should return null if B2 exists', () => {
            const v = new VOD({
                videoSrcHash: ipfsHashFixture
            })
            const method = v.getMethodToEnsureIpfs();
            expect(method).to.be.null;  
        })
        it('should return null if neither videoSrc nor videoSrcHash exists', () => {
            const v = new VOD({});
            expect(v.getMethodToEnsureIpfs()).to.be.null;
        })
    })

    xdescribe('generateThumbnail', () => {});

    describe('getMethodToEnsureThumbnail', () => {
        it('should return {function} this.generateThumbnail if thumbnail is missing', () => {
            const v = new VOD({
                thiccHash: ''
            })
            const method = v.getMethodToEnsureThumbnail();
            expect(method).to.be.an.instanceof(Function);
        })
        it('should return null if Thumbnail exists', () => {
            const v = new VOD({
                thiccHash: thiccHashFixture
            })
            const method = v.getMethodToEnsureThumbnail();
            expect(method).to.be.null;  
        })
    })

    describe('hasIpfs', () => {
        it('should return true if vod.videoSrcHash exists', () => {
            const v = new VOD({
                videoSrcHash: ipfsHashFixture
            })
            expect(v.hasIpfs()).to.be.true
        })
        it('should return false if vod.videoSrcHash is empty', () => {
            const v = new VOD({
                videoSrcHash: ''
            })
            expect(v.hasIpfs()).to.be.false
        })
    })

    describe('hasB2', () => {
        it('should return true if VOD.videoSrc exists', () => {
            const v = new VOD({
                videoSrc: b2VODFixture
            })
            expect(v.hasB2()).to.be.true
        })
        it('should return false if VOD.videoSrc is empty', () => {
            const v = new VOD({
                videoSrc: ''
            })
            expect(v.hasB2()).to.be.false
        })
    })

    describe('isMissingZuluDate', () => {
        it('should return false if date is present', () => {
            const v = new VOD({
                date: '3021-10-16T00:00:00.000Z'
            })
            expect(v.isMissingZuluDate()).to.be.false;
        });
        it('should return true if date is missing', () => {
            const v = new VOD({});
            expect(v.isMissingZuluDate()).to.be.true;
        });
    })


    describe('isMissingB2', () => {
        it('should exist as a class method', () => {
            const v = new VOD({});
            expect(VOD.isMissingB2).to.be.undefined
            expect(v.isMissingB2).to.not.be.undefined
        })
        it('should return false if VOD.videoSrc exists', () => {
            const v = new VOD({
                videoSrc: b2VODFixture
            });
            const res = v.isMissingB2();
            expect(res).to.be.false;
        })
        it('should return true if VOD.videoSrc does not exist', () => {
            const v = new VOD({
                videoSrc: ''
            });
            const res = v.isMissingB2();
            expect(res).to.be.true;
        })
    })

    describe('isMissingThumbnail', () => {
        it('should return false if vod.thiccHash exists', () => {
            const v = new VOD({
                thiccHash: thiccHashFixture
            });
            const res = v.isMissingThumbnail();
            expect(res).to.be.false;
        })
        it('should return true if vod.thiccHash does not exist', () => {
            const v = new VOD({
                thiccHash: ''
            });
            const res = v.isMissingThumbnail();
            expect(res).to.be.true;
        })
    })

    describe('isMissingIpfs', () => {
        it('should return false if VOD.videoSrcHash exists', () => {
            const v = new VOD({
                videoSrcHash: ipfsHashFixture
            });
            const res = v.isMissingIpfs();
            expect(res).to.be.false;
        })
        it('should return true if VOD.videoSrcHash does not exist', () => {
            const v = new VOD({
                videoSrcHash: ''
            });
            const res = v.isMissingIpfs();
            expect(res).to.be.true;
        })
    })

    describe('determineNecessaryActionsToEnsureComplete', () => {
        it('Existence of B2 and date, absense of IPFS and thumbnail', () => {
            const v = new VOD({
                videoSrc: b2VODFixture,
                date: new Date()
            })
            const actions = v.determineNecessaryActionsToEnsureComplete();
            console.log(actions)
            expect(actions).to.have.lengthOf(2) // thumbnail and ipfs functions
        })
        it('existence of ipfs and date, absence of b2 and thumbnail', () => {
            const v = new VOD({
                videoSrcHash: ipfsHashFixture,
                date: new Date()
            })
            const actions = v.determineNecessaryActionsToEnsureComplete()
            expect(actions).to.have.lengthOf(2) // thumbnail and ipfs functions
        })
        it('existence of ipfs, absence of b2 and date and thumnail', () => {
            const v = new VOD({
                videoSrcHash: ipfsHashFixture,
            })
            const actions = v.determineNecessaryActionsToEnsureComplete()
            expect(actions).to.have.lengthOf(3) // thumbnail and ipfs and date functions
        })
    })
})