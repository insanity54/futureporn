

import { expect } from 'chai';
import VOD from '../utils/VOD.js';
import path from 'path';
import matter from 'gray-matter';
import fsp from 'fs/promises';
import { fileURLToPath } from 'url';
import { parseISO, isEqual, isValid } from 'date-fns';

const __dirname = fileURLToPath(path.dirname(import.meta.url)); // esm workaround for missing __dirname
const pngFixture = path.join(__dirname, './cj_clippy_avatar.png');
const b2VODFixture = 'https://f000.backblazeb2.com/file/futureporn/projektmelody-chaturbate-3021-10-16T00%3A00%3A00.000Z.mp4';
const ipfsHashFixture = 'bafkreiek3g2fikcwe672ayjeab3atgpmxlyfv32clxfcu5r4xv66iz4nlm';
const annouceUrlFixture = 'https://twitter.com/ProjektMelody/status/1272965936685953024'
const thiccHashFixture = 'bafkreiek3g2fikcwe672ayjeab3atgpmxlyfv32clxfcu5r4xv66iz4nlm';
const futureDateFixture = '3021-10-16T00:00:00.000Z';
const mp4Fixture = path.join(__dirname, 'testvid.mp4');
const mp4FixtureThiccHash = 'bafkreifquwillzg5jvp4cgjl7ki567ipmhp5zhyd6o2qft4flsmasbti6q';
const mp4FixtureThinHash = 'bafkreibxdmuhnjaqqzrmhaeuo3elqw5wz53wlhbmfyjjjiw6o7mo4yngnu';
const mkvFixture = path.join(__dirname, 'testvid.mkv');
const ipfsHashRegex = /Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,}/;
const mp4Regex = /\.mp4/;


describe('VOD', function () {

    after(async function () {
        const testVodMd = path.join(__dirname, '..', 'website', 'vods', '3021-10-16T000000Z.md');
        try {
            await fsp.unlink(testVodMd)
        } catch (e) {
            //console.log('testVodMd not exists but thats okay')
        }
    })

    describe('instance', function () {
        it('should have a tmpFilePath property', function () {
            expect(new VOD({})).to.have.property('tmpFilePath', '')
        })
    })

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
            expect(res).to.match(/\/futureporn\/website\/vods\/30311016T000000Z\.md/);
            expect(path.isAbsolute(res)).to.be.true;
        })
    })

    describe('saveMarkdown', function () {
        const date = '3021-10-16T00:30:00Z';
        const safeDate = '30211016T003000Z';
        after(async function () {
            await fsp.unlink(path.join(__dirname, '..', 'website', 'vods', `${safeDate}.md`))
        })
        it('should save the vod data to disk as markdown', async function () {
            const note = 'This is not an actual VOD. This is only a test.';
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
                `${safeDate}.md`
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

    xdescribe('downloadFromB2', function () {
        this.timeout(30000)
        it('should download a file to /tmp', async function () {
            const v = new VOD({
                videoSrc: b2VODFixture,
                date: futureDateFixture
            })
            const res = await v.downloadFromB2(b2VODFixture);
            const target = '/tmp/projektmelody-chaturbate-30211016T000000Z.mp4';
            expect(v.tmpFilePath).to.equal(target);
            const stat = await fsp.lstat(target);
            expect(stat.size).to.equal(699305);
        })
    })

    describe('downloadFromIpfs', function () {
        this.timeout(60000)
        it('should download a file to /tmp', async function () {
            const v = new VOD({
                date: futureDateFixture,
                videoSrcHash: ipfsHashFixture
            })
            await v.downloadFromIpfs(ipfsHashFixture);
            const target = '/tmp/projektmelody-chaturbate-30211016T000000Z.mp4';
            expect(v.tmpFilePath).to.equal(target);
            const stat = await fsp.lstat(target);
            expect(stat.size).to.equal(202524);
        })
    })

    describe('getDatestamp', function () {
        it('should return a formatted ISO date in Zulu tz', function () {
            const v = new VOD({ date: '3021-10-16' });
            expect(v.getDatestamp()).to.equal('3021-10-16T00:00:00.000Z');
        })
    })


    describe('getSafeDatestamp', function () {
        it('should return a basic formatted ISO date in Zulu tz', function () {
            const v = new VOD({ date: '3021-10-16' });
            expect(v.getSafeDatestamp()).to.equal('30211016T000000Z');
        })
    })

    describe('getVideoBasename', () => {
        it('should generate a unique filename using the date', () => {
            const v = new VOD({
                date: '3021-10-16T00:00:00.000Z'
            })
            const filename = v.getVideoBasename();
            expect(filename).to.equal('projektmelody-chaturbate-30211016T000000Z.mp4');
        })
    })

    describe('encodeVideo', function () {
        this.timeout(60000);
        it('should transcode a mkv listed in VOD.tmpFilePath and then overwrite VOD.tmpFilePath with the mp4', async function () {
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mkvFixture
            });
            await v.encodeVideo();
            expect(v.tmpFilePath).to.match(mp4Regex);
        });
        it('should do nothing when the VOD.tmpFilePath video is already an mp4', async function () {
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mp4Fixture
            })
            await v.encodeVideo();
            expect(v.tmpFilePath).to.equal(mp4Fixture);
        })
    });

    describe('uploadToIpfs', function () {
        this.timeout(45000);
        it('should upload a file and save the cid to vod.videoSrcHash', async function () {
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: path.join(__dirname, 'cj_clippy_avatar.png')
            });
            await v.uploadToIpfs();
            expect(v.videoSrcHash).to.match(ipfsHashRegex);
        })
        it('should first transcode a mkv to mp4', async function () {
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mkvFixture
            });
            await v.uploadToIpfs();
            expect(v.tmpFilePath).to.match(mp4Regex);
            expect(v.videoSrcHash).to.match(ipfsHashRegex);
        })
        it('should upload a mp4', async function () {
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mp4Fixture
            });
            await v.uploadToIpfs();
            expect(v.videoSrcHash).to.match(ipfsHashRegex); 
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
        it('should urlencode double quotes', function () {
            expect(VOD.getSafeText('Hello "world"')).to.equal("Hello%20%22world%22");
        })
        it('should urlencode asterisks', function () {
            const unsafeMessage = '*this';
            expect(VOD.getSafeText(unsafeMessage)).to.equal("%2athis");
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

    describe('getMethodToEnsureTmpFilePath', function() {
        it('should return {function} downloadFromIpfs if videoSrcHash exists', function () {
            const v = new VOD({

            })
        })
    })

    describe('getMethodToEnsureB2', function () {
        it('should return {function} this.uploadToB2 if videoSrc is missing', function () {
            const v = new VOD({
                videoSrc: '',
                tmpFilePath: mp4Fixture,
            })
            const method = v.getMethodToEnsureB2();
            expect(method).to.be.an.instanceof(Function);
            expect(method).to.have.property('name', 'uploadToB2');
        })
        it('should return null if videoSrc exists', function () {
            const v = new VOD({
                videoSrc: b2VODFixture
            })
            const method = v.getMethodToEnsureB2();
            expect(method).to.be.null;  
        })
        it('should throw an error if neither tmpFilePath nor videoSrcHash exists', function () {
            const v = new VOD({});
            expect(v.getMethodToEnsureB2).to.throw;
        })
    })

    describe('getIpfsUrl', function () {
        it('should return ipfs.io url', function () {
            const date = '30211016T000000Z';
            const v = new VOD({ videoSrcHash: ipfsHashFixture, date: date });
            expect(v.getIpfsUrl()).to.equal(`https://ipfs.io/ipfs/${ipfsHashFixture}?filename=projektmelody-chaturbate-${date}.mp4`)
        })
    })

    describe('ensureIpfs', function () {
        xit('should return a promise', function () {

        });
        it('should ')
    });

    describe('getMethodsToEnsureIpfs', function () {
        it('should return an array of functions', function () {
            const v = new VOD({
                tmpFilePath: mp4Fixture
            })
            expect(v.getMethodsToEnsureIpfs()).to.be.a('array');
        })
        it('should return an empty array if ipfs already exists', function () {
            const v = new VOD({
                videoSrcHash: ipfsHashFixture
            });
            const methods = v.getMethodsToEnsureIpfs();
            expect(methods).to.be.a('array');
            expect(methods).to.have.lengthOf(0);
        })
        it('should return an array with {function} downloadFromB2, encodeVideo, and uploadToIpfs if only videoSrc exists', function () {
            const v = new VOD({
                videoSrc: b2VODFixture,
                date: futureDateFixture
            })
            const methods = v.getMethodsToEnsureIpfs();
            expect(methods[0]).to.have.property('name', 'downloadFromB2');
            expect(methods[1]).to.have.property('name', 'encodeVideo');
            expect(methods[2]).to.have.property('name', 'uploadToIpfs');
        })
        it('should return an empty array if neither videoSrc nor tmpFilePath exists', function () {
            const v = new VOD({});
            const methods = v.getMethodsToEnsureIpfs();
            expect(methods).to.be.a('array');
            expect(methods).to.have.lengthOf(0);
        })
        it('should return an arrray with {function} uploadToIpfs if tmpFilePath contains an mp4', function () {
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mp4Fixture
            });
            const methods = v.getMethodsToEnsureIpfs();
            expect(methods).to.be.a('array');
            expect(methods[0]).to.be.a('function');
            expect(methods[0]).to.have.property('name', 'uploadToIpfs');
        })
        it('should return an arrray with {function} encodeVideo and {function} uploadToIpfs if tmpFilePath contains a mkv', function () {
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mkvFixture
            });
            const methods = v.getMethodsToEnsureIpfs();
            expect(methods).to.be.a('array');
            expect(methods[0]).to.be.a('function');
            expect(methods[0]).to.have.property('name', 'encodeVideo');
            expect(methods[1]).to.be.a('function');
            expect(methods[1]).to.have.property('name', 'uploadToIpfs');
        })
    })


    describe('generateThumbnail', function () {
        this.timeout(60000);
        it('should populate thiccHash and thinHash', async function () {
            const v = new VOD({
                tmpFilePath: mp4Fixture
            })
            await v.generateThumbnail();
            expect(v).to.have.property('thiccHash', mp4FixtureThiccHash);
            expect(v).to.have.property('thinHash', mp4FixtureThinHash);
        })
    });

    describe('getMethodToEnsureEncode', function () {
        it('should return {function} encodeVideo if tmpFilePath contains an mkv', function () {
            const v = new VOD({
                tmpFilePath: mkvFixture
            })
            const method = v.getMethodToEnsureEncode();
            expect(method).to.be.an.instanceof(Function);
            expect(method).to.have.property('name', 'encodeVideo');
        })
        it('should return null if tmpFilePath contains an mp4', function () {
            const v = new VOD({
                tmpFilePath: mp4Fixture
            })
            const method = v.getMethodToEnsureEncode();
            expect(method).to.be.null;  
        })
    })

    describe('getMethodToEnsureTmpFilePath', function () {
        it('should return {function} downloadFromIpfs if tmpFilePath is missing and videoSrcHash exists', function () {
            const v = new VOD({
                videoSrcHash: ipfsHashFixture
            })
            const method = v.getMethodToEnsureTmpFilePath();
            expect(method).to.be.a('function');
            expect(method).to.have.property('name', 'downloadFromIpfs');
        })
        it('should prefer downloadFromIpfs over downloadFromB2', function () {
            const v = new VOD({
                videoSrcHash: ipfsHashFixture,
                videoSrc: b2VODFixture
            })
            const method = v.getMethodToEnsureTmpFilePath();
            expect(method).to.be.a('function');
            expect(method).to.have.property('name', 'downloadFromIpfs');
        })
        it('should return {function} downloadFromB2 when videoSrc is available and videoSrcHash is not', function () {
            const v = new VOD({
                videoSrc: b2VODFixture
            })
            const method = v.getMethodToEnsureTmpFilePath();
            expect(method).to.be.a('function');
            expect(method).to.have.property('name', 'downloadFromB2');
        })
    })

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

    describe('hasTmpFilePath', function () {
        it('should return true if VOD.tmpFilePath exists', function () {
            const v = new VOD({
                tmpFilePath: '/tmp/mycoolfile.fake'
            })
            const res = v.hasTmpFilePath()
            expect(res).to.be.true
        })
        it('should return false if VOD.tmpFilePath is empty', function () {
            const v = new VOD({
                tmpFilePath: ''
            })
            expect(v.hasTmpFilePath()).to.be.false
        })
    })

    describe('isTmpFilePathMkv', function () {
        it('should return true when mkv', function () {
            const v = new VOD({
                tmpFilePath: mkvFixture
            })
            const res = v.isTmpFilePathMkv()
            expect(res).to.be.true
        })
        it('should return false when mp4', function () {
            const v = new VOD({
                tmpFilePath: mp4Fixture
            })
            expect(v.isTmpFilePathMkv()).to.be.false
        })
    })

    describe('isMissingTmpFilePath', function () {
        it('should return false if date is present', function () {
            const v = new VOD({
                tmpFilePath: '/tmp/mycoolfile.fake'
            })
            expect(v.isMissingTmpFilePath()).to.be.false;
        });
        it('should return true if date is missing', function () {
            const v = new VOD({});
            expect(v.isMissingTmpFilePath()).to.be.true;
        });
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
                date: futureDateFixture
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
        it('should handle a missing date', function () {
            const v = new VOD({
                announceUrl: 'https://twitter.com/ProjektMelody/status/1225922638687752192'
            })
            const actions = v.determineNecessaryActionsToEnsureComplete();
            for (const action of actions) expect(action).to.be.a('function');
            expect(actions[0]).to.have.property('name', 'getDateFromTwitter');
        })
        it('should handle when only videoSrc and date exists', function () {
            const v = new VOD({
                videoSrc: b2VODFixture,
                date: futureDateFixture
            })
            const actions = v.determineNecessaryActionsToEnsureComplete();
            for (const action of actions) expect(action).to.be.a('function');
            expect(actions[0]).to.have.property('name', 'downloadFromB2');
            expect(actions[1]).to.have.property('name', 'generateThumbnail');
            expect(actions[2]).to.have.property('name', 'uploadToIpfs');
        })
        it('should handle when tmpFilePath exists and is an mp4', function () {
            const v = new VOD({
                tmpFilePath: path.join(__dirname, 'testvid.mp4')
            })
            const actions = v.determineNecessaryActionsToEnsureComplete();
            for (const action of actions) expect(action).to.be.a('function');
            expect(actions[1]).to.have.property('name', 'generateThumbnail');
            expect(actions[2]).to.have.property('name', 'uploadToIpfs');
        })
        it('should handle when tmpFilePath exists and is an mkv', function () {
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: path.join(__dirname, 'testvid.mkv')
            })
            const actions = v.determineNecessaryActionsToEnsureComplete();
            for (const action of actions) expect(action).to.be.a('function');
            expect(actions[0]).to.have.property('name', 'encodeVideo');
            expect(actions[1]).to.have.property('name', 'generateThumbnail');
            expect(actions[2]).to.have.property('name', 'uploadToIpfs');
        })
        it('should handle when only videoSrcHash exists', function () {
            const v = new VOD({
                videoSrcHash: ipfsHashFixture,
            })
            const actions = v.determineNecessaryActionsToEnsureComplete()
            for (const action of actions) expect(action).to.be.a('function');
            expect(actions[0]).to.have.property('name', 'getDateFromTwitter');
            expect(actions[1]).to.have.property('name', 'downloadFromIpfs');
            expect(actions[2]).to.have.property('name', 'generateThumbnail');
            expect(actions[3]).to.have.property('name', 'uploadToB2');
        })
        it('should handle when tmpFilePath exists, and videoSrcHash does not', function () {
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mp4Fixture,
            })
            const actions = v.determineNecessaryActionsToEnsureComplete()
            expect(actions[0]).to.be.a('function');
            expect(actions[1]).to.be.a('function');
            expect(actions[0]).to.have.property('name', 'generateThumbnail');
            expect(actions[1]).to.have.property('name', 'uploadToIpfs');
        })
    })
})