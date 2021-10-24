

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

describe('VOD', function () {

    describe('getTweetIdFromAnnounceUrl', function () {
        it('should find the tweet ID', function () {
            const v = new VOD({
                announceUrl: annouceUrlFixture
            })
            expect(v.getTweetIdFromAnnounceUrl()).to.equal('1272965936685953024');
        })
    })

    describe('getDateFromTwitter', function () {
        it('should reach out to twitter and return the ISO date', async function () {
            const v = new VOD({
                announceUrl: annouceUrlFixture
            })
            await v.getDateFromTwitter();
            expect(isEqual(v.date, new Date('2020-06-16T18:55:04.000Z'))).to.be.true;
        })
    })


    describe('default', function () {
        it("should accept '' and return ''", function () {
            expect(VOD.default('')).to.equal('');
        })
        it("should accept 'yolo' and return 'yolo'", function () {
            expect(VOD.default('yolo')).to.equal('yolo');
        })
        it("should accept {Date} and return {Date}", function () {
            const d = new Date();
            expect(VOD.default(d)).to.equal(d);
        })
        it("should accept undefined and return ''", function () {
            expect(VOD.default(undefined)).to.equal('');
        })
    })

    describe('parseDate', function () {
        it('should accept {String} 2021-10-16 and return a Date', function () {
            const d = VOD.parseDate('2021-10-16');
            expect(d).to.be.an.instanceof(Date);
            expect(isValid(d)).to.be.true;
        })
        it('should accept 2021-10-16T00:00:00.000Z and return a Date', function () {
            const d = VOD.parseDate('2021-10-16T00:00:00.000Z');
            expect(d).to.be.an.instanceof(Date);
            expect(isValid(d)).to.be.true;
        })
        it("should accept '' and return ''", function () {
            const d = VOD.parseDate('');
            expect(d).to.equal('');
        })
        it("should accept undefined and return ''", function () {
            const d = VOD.parseDate(undefined);
            expect(d).to.equal('');
        })
    })

    describe('getMarkdownFilename', function () {
        it('should return an absolute path with no spaces', function () {
            const v = new VOD({
                date: '3031-10-16T00:00:00.000Z'
            })
            const res = v.getMarkdownFilename();
            expect(typeof res).to.equal('string');
            expect(res).to.match(/\/futureporn\/website\/vods\/3031-10-16T00:00:00\.000Z\.md/);
            expect(path.isAbsolute(res)).to.be.true;
        })
    })

    describe('saveMarkdown', function () {
        after(async function () {
            await fsp.unlink(path.join(__dirname, '..', 'website', 'vods', '3021-10-16T00:30:00.000Z.md'))
        })
        it('should save the vod data to disk as markdown', async function () {
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

    xdescribe('downloadFromIPFS', function () {
        it('should download a file to /tmp', async function () {
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

    describe('getDatestamp', function () {
        it('should return a date in Zulu tz', function () {
            const v = new VOD({ date: '3021-10-16' });
            expect(v.getDatestamp()).to.equal('3021-10-16T00:00:00.000Z');
        })
    })

    describe('getVideoBasename', function () {
        it('should generate a unique filename using the date', function () {
            const v = new VOD({
                date: '3021-10-16T00:00:00.000Z'
            })
            const filename = v.getVideoBasename();
            expect(filename).to.equal('projektmelody-chaturbate-3021-10-16T00:00:00.000Z.mp4');
        })
    })

    describe('uploadToIpfs', function () {
        this.timeout(30000);
        it('should upload a file and save the cid to vod.videoSrcHash', async function () {
            const v = new VOD({
                tmpFilePath: path.join(__dirname, 'cj_clippy_avatar.png')
            });
            await v.uploadToIpfs();
            expect(v.videoSrcHash).to.equal(thiccHashFixture);
        })
    })

    xdescribe('uploadToB2', function () {
        it('should upload a file to Backblaze', async function () {
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

    describe('getSafeText', function () {
        it('should escape double quotes', function () {
            expect(VOD.getSafeText('Hello "world"')).to.match(/\\"world\\"/);
        })
    })

    describe('getTmpDownloadPath', function () {
        it('should return something like /tmp/<filename>.<extension>', function () {
            const dlPath = VOD.getTmpDownloadPath('myfile.txt');
            expect(dlPath).to.equal('/tmp/myfile.txt');
        })
    })

    describe('getMethodToEnsureDate', function () {
        it('should return {function} this.getDateFromTwitter if date is missing', function () {
            const v = new VOD({
                videoSrcHash: ipfsHashFixture
            })
            const method = v.getMethodToEnsureDate();
            expect(method).to.be.an.instanceof(Function);
        })
        it('should return null if date is present', function () {
            const v = new VOD({
                date: '3021-10-16'
            })
            const method = v.getMethodToEnsureDate();
            expect(method).to.be.null;
        })
        it('should return null if zulu date exists', function () {
            const v = new VOD({
                date: '3021-10-16T00:00:00.000Z'
            })
            const method = v.getMethodToEnsureDate();
            expect(method).to.be.null;
        })
    })

    describe('getMethodToEnsureB2', function () {
        it('should return {function} this.copyIpfsToB2 if B2 is missing', function () {
            const v = new VOD({
                videoSrc: '',
                videoSrcHash: ipfsHashFixture
            })
            const method = v.getMethodToEnsureB2();
            expect(method).to.be.an.instanceof(Function);
        })
        it('should return null if B2 exists', function () {
            const v = new VOD({
                videoSrc: b2VODFixture,
                videoSrcHash: ipfsHashFixture
            })
            const method = v.getMethodToEnsureB2();
            expect(method).to.be.null;  
        })
        it('should return null if neither videoSrc nor videoSrcHash exists', function () {
            const v = new VOD({});
            expect(v.getMethodToEnsureB2()).to.be.null;
        })
    })

    describe('getIpfsUrl', function () {
        it('should return ipfs.io url', function () {
            const date = '3021-10-16T00:00:00.000Z';
            const v = new VOD({ videoSrcHash: ipfsHashFixture, date: date });
            expect(v.getIpfsUrl()).to.equal(`https://ipfs.io/ipfs/${ipfsHashFixture}?filename=projektmelody-chaturbate-${date}.mp4`)
        })
    })

    describe('getMethodToEnsureIpfs', function () {
        it('should return {function} this.copyB2ToIpfs if ipfs is missing', function () {
            const v = new VOD({
                videoSrcHash: '',
                videoSrc: b2VODFixture
            })
            const method = v.getMethodToEnsureIpfs();
            expect(method).to.be.an.instanceof(Function);
        })
        it('should return null if B2 exists', function () {
            const v = new VOD({
                videoSrcHash: ipfsHashFixture
            })
            const method = v.getMethodToEnsureIpfs();
            expect(method).to.be.null;  
        })
        it('should return null if neither videoSrc nor videoSrcHash exists', function () {
            const v = new VOD({});
            expect(v.getMethodToEnsureIpfs()).to.be.null;
        })
    })

    xdescribe('generateThumbnail', function () {});

    describe('getMethodToEnsureThumbnail', function () {
        it('should return {function} this.generateThumbnail if thumbnail is missing', function () {
            const v = new VOD({
                thiccHash: ''
            })
            const method = v.getMethodToEnsureThumbnail();
            expect(method).to.be.an.instanceof(Function);
        })
        it('should return null if Thumbnail exists', function () {
            const v = new VOD({
                thiccHash: thiccHashFixture
            })
            const method = v.getMethodToEnsureThumbnail();
            expect(method).to.be.null;  
        })
    })

    describe('hasIpfs', function () {
        it('should return true if vod.videoSrcHash exists', function () {
            const v = new VOD({
                videoSrcHash: ipfsHashFixture
            })
            expect(v.hasIpfs()).to.be.true
        })
        it('should return false if vod.videoSrcHash is empty', function () {
            const v = new VOD({
                videoSrcHash: ''
            })
            expect(v.hasIpfs()).to.be.false
        })
    })

    describe('hasB2', function () {
        it('should return true if VOD.videoSrc exists', function () {
            const v = new VOD({
                videoSrc: b2VODFixture
            })
            expect(v.hasB2()).to.be.true
        })
        it('should return false if VOD.videoSrc is empty', function () {
            const v = new VOD({
                videoSrc: ''
            })
            expect(v.hasB2()).to.be.false
        })
    })

    describe('isMissingZuluDate', function () {
        it('should return false if date is present', function () {
            const v = new VOD({
                date: '3021-10-16T00:00:00.000Z'
            })
            expect(v.isMissingZuluDate()).to.be.false;
        });
        it('should return true if date is missing', function () {
            const v = new VOD({});
            expect(v.isMissingZuluDate()).to.be.true;
        });
    })


    describe('isMissingB2', function () {
        it('should exist as a class method', function () {
            const v = new VOD({});
            expect(VOD.isMissingB2).to.be.undefined
            expect(v.isMissingB2).to.not.be.undefined
        })
        it('should return false if VOD.videoSrc exists', function () {
            const v = new VOD({
                videoSrc: b2VODFixture
            });
            const res = v.isMissingB2();
            expect(res).to.be.false;
        })
        it('should return true if VOD.videoSrc does not exist', function () {
            const v = new VOD({
                videoSrc: ''
            });
            const res = v.isMissingB2();
            expect(res).to.be.true;
        })
    })

    describe('isMissingThumbnail', function () {
        it('should return false if vod.thiccHash exists', function () {
            const v = new VOD({
                thiccHash: thiccHashFixture
            });
            const res = v.isMissingThumbnail();
            expect(res).to.be.false;
        })
        it('should return true if vod.thiccHash does not exist', function () {
            const v = new VOD({
                thiccHash: ''
            });
            const res = v.isMissingThumbnail();
            expect(res).to.be.true;
        })
    })

    describe('isMissingIpfs', function () {
        it('should return false if VOD.videoSrcHash exists', function () {
            const v = new VOD({
                videoSrcHash: ipfsHashFixture
            });
            const res = v.isMissingIpfs();
            expect(res).to.be.false;
        })
        it('should return true if VOD.videoSrcHash does not exist', function () {
            const v = new VOD({
                videoSrcHash: ''
            });
            const res = v.isMissingIpfs();
            expect(res).to.be.true;
        })
    })

    describe('determineNecessaryActionsToEnsureComplete', function () {
        it('Existence of B2 and date, absense of IPFS and thumbnail', function () {
            const v = new VOD({
                videoSrc: b2VODFixture,
                date: new Date()
            })
            const actions = v.determineNecessaryActionsToEnsureComplete();
            console.log(actions)
            expect(actions).to.have.lengthOf(2) // thumbnail and ipfs functions
        })
        it('existence of ipfs and date, absence of b2 and thumbnail', function () {
            const v = new VOD({
                videoSrcHash: ipfsHashFixture,
                date: new Date()
            })
            const actions = v.determineNecessaryActionsToEnsureComplete()
            expect(actions).to.have.lengthOf(2) // thumbnail and ipfs functions
        })
        it('existence of ipfs, absence of b2 and date and thumnail', function () {
            const v = new VOD({
                videoSrcHash: ipfsHashFixture,
            })
            const actions = v.determineNecessaryActionsToEnsureComplete()
            expect(actions).to.have.lengthOf(3) // thumbnail and ipfs and date functions
        })
    })
})