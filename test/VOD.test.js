

import { use, expect } from 'chai';
import VOD from '../utils/VOD.js';
import path from 'path';
import matter from 'gray-matter';
import fsp from 'fs/promises';
import { fileURLToPath } from 'url';
import { parseISO, isEqual, isValid } from 'date-fns';
import chaiAsPromised from 'chai-as-promised';

use(chaiAsPromised);

const __dirname = fileURLToPath(path.dirname(import.meta.url)); // esm workaround for missing __dirname
const pngFixture = path.join(__dirname, './cj_clippy_avatar.png');
const videoSrcFixture = 'https://f000.backblazeb2.com/file/futureporn/testvid.mp4';
const videoSrcHashFixture = 'bafkreifufx6uharnts5wy6smk7mxmlwg7fpzhf5s3n33kydfgr7zqhagme';
const video240HashFixture = 'bafkreifkv6h7ceavdgymqn6b3uqpvpfictjorrwkp5q4v4jzeen3jncvci';
const ipfsHashFixture = 'bafkreiek3g2fikcwe672ayjeab3atgpmxlyfv32clxfcu5r4xv66iz4nlm';
const annouceUrlFixture = 'https://twitter.com/ProjektMelody/status/1272965936685953024'
const thiccHashFixture = 'bafkreifb7opo6tqsftfnjmufo47e7nyuhnj2qcsd3bpqlbwwiyvot6ck5y';
const futureDateFixture = '3021-10-16T00:00:00.000Z';
const mp4Fixture = path.join(__dirname, 'testvid.mp4');
const mp4FixtureThiccHash = 'bafkreifb7opo6tqsftfnjmufo47e7nyuhnj2qcsd3bpqlbwwiyvot6ck5y';
const mp4FixtureThinHash = 'bafkreig4n7tkww4uqkqpca7fbw7vm42nohyrixexd2klxbmrvrhawewyeq';
const mkvFixture = path.join(__dirname, 'testvid.mkv');
const ipfsHashRegex = /Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,}/;
const mp4Regex = /\.mp4/;
const doubleEncodedText = "Salutation%2520my%2520bruddas.%2520Gonna%2520be%2520along%2520fun%2520day%252C%2520starting%2520with%2520CB%2521%2521";
const singleEncodedText = "Salutation%20my%20bruddas.%20Gonna%20be%20along%20fun%20day%2C%20starting%20with%20CB%21%21"
const notEncodedText = "Salutation my bruddas. Gonna be along fun day, starting with CB!!";


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
            const d = VOD._parseDate('2021-10-16');
            expect(d).to.be.an.instanceof(Date);
            expect(isValid(d)).to.be.true;
        })
        it('should accept 2021-10-16T00:00:00.000Z and return a Date', function () {
            const d = VOD._parseDate('2021-10-16T00:00:00.000Z');
            expect(d).to.be.an.instanceof(Date);
            expect(isValid(d)).to.be.true;
        })
        it("should accept '' and return ''", function () {
            const d = VOD._parseDate('');
            expect(d).to.equal('');
        })
        it("should accept undefined and return ''", function () {
            const d = VOD._parseDate(undefined);
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
                videoSrcHash: videoSrcFixture,
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
            expect(m.data).to.have.property('videoSrcHash', videoSrcFixture);
            expect(m.data).to.have.property('note', note);
            expect(m.data).to.have.property('date');
            expect(m.data).to.have.property('video240Hash');
            expect(m.data).to.have.property('video240TmpFilePath');
            expect(m.data).to.have.property('tmpFilePath');
            expect(m.data.date).to.be.an.instanceof(Date);
            expect(isEqual(m.data.date, parseISO(date))).to.be.true;
        })
    })

    describe('downloadFromB2', function () {
        this.timeout(30000)
        it('should download a file to /tmp', async function () {
            const v = new VOD({
                videoSrc: videoSrcFixture,
                date: futureDateFixture
            })
            const res = await v.downloadFromB2(videoSrcFixture);
            const target = '/tmp/projektmelody-chaturbate-30211016T000000Z.mp4';
            expect(v.tmpFilePath).to.equal(target);
            const stat = await fsp.lstat(target);
            expect(stat.size).to.equal(175645);
        })
    })

    describe('downloadFromIpfs', function () {
        this.timeout(300000) // 5 min
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
        it('should throw if there is no date', function () {
            const v = new VOD({});
            expect(function() { v.getSafeDatestamp() }).to.throw(/date is missing/);
        })
    })

    describe('_getIpfsHash', () => {
        it('should strip away any query parameters and gateway url leaving only an ipfs hash', () => {
            expect(VOD._getIpfsHash('https://ipfs.io/ipfs/bafybeiay5gbvtseoldxc4hduflzx2tjjqhcry3dyylxa7q47pbobkvu27a?filename=projektmelody-chaturbate-20211112T000700Z.mp4')).to.match(ipfsHashRegex);
        })
    })

    describe('_getVideoBasename', () => {
        it('should generate a unique filename using the date', () => {
            const v = new VOD({
                date: '3021-10-16T00:00:00.000Z'
            })
            const filename = v._getVideoBasename();
            expect(filename).to.equal('projektmelody-chaturbate-30211016T000000Z.mp4');
        })
        it('should accept a {string} parameter and insert it before the file extension', () => {
            const v = new VOD({
                date: '3021-10-16T00:00:00.000Z'
            })
            const filename = v._getVideoBasename('240p');
            expect(filename).to.equal('projektmelody-chaturbate-30211016T000000Z-240p.mp4');  
        })
    })

    xdescribe('_getIpfsHashWithFilename', function () {
        it('should accept a hash as parameter and append filename to the end of hash', function () {
            const v = new VOD({
                date: futureDateFixture
            });
            expect(v._getIpfsHashWithFilename())
        })
    })

    describe('ensureTextFormatting', function () {

        it('should ensure that announceTitle is URL encoded', async function () {
            const v = new VOD({
                date: futureDateFixture,
                announceTitle: notEncodedText
            })
            await v.ensureTextFormatting();
            expect(v).to.have.property('announceTitle', singleEncodedText);
        })
        it('should remove double URL encoding on announceTitle', async function () {
            const v = new VOD({
                date: futureDateFixture,
                announceTitle: doubleEncodedText
            })
            await v.ensureTextFormatting();
            expect(v).to.have.property('announceTitle', singleEncodedText);
        })
        it('should ensure that title is URL encoded', async function () {
            const v = new VOD({
                date: futureDateFixture,
                title: notEncodedText
            })
            await v.ensureTextFormatting();
            expect(v).to.have.property('title', singleEncodedText);
        })
        it('should remove double URL encoding on title', async function () {
            const v = new VOD({
                date: futureDateFixture,
                title: doubleEncodedText
            })
            await v.ensureTextFormatting();
            expect(v).to.have.property('title', singleEncodedText);
        })
    })

    describe('ensureVideoSrcHash', function () {
        this.timeout(1000*60*20);
        it('should upload an mp4 listed in tmpFilePath to ipfs and populate videoSrcHash', async function () {
            const expectedVideoSrcHash = `${videoSrcHashFixture}?filename=projektmelody-chaturbate-30211016T000000Z-source.mp4`
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mp4Fixture
            });
            await v.ensureVideoSrcHash();
            expect(v.videoSrcHash).to.equal(expectedVideoSrcHash);
        });
        it('should transcode an mkv listed in tmpFilePath to mp4, then upload to ipfs and populate videoSrcHash', async function () {
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mkvFixture
            });
            await v.ensureVideoSrcHash();
            expect(v.videoSrcHash).to.equal('bafkreigencclktw34fjka3kebamncvl4wyovwyzn5idntnu5f7iegl3u3u?filename=projektmelody-chaturbate-30211016T000000Z-source.mp4')
        });
        xit('should populate videoSrcHashTmp after transcoding an mkv to mp4', async function () {
            // there is a potential problem where the transcode is unecessarily re-done because the previous run of this function exited with error
            // I don't think i want to implement this.
            // the absense of videoSrcHashTmp is only a problem if the program is interrupted
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mkvFixture
            });
            await v.ensureVideoSrcHash();
            expect(v.videoSrcHashTmp).to.match(/\/tmp\/.*.mp4/);
        });
        it('should do nothing if videoSrcHash already exists', async function () {
            const v = new VOD({
                date: futureDateFixture,
                videoSrcHash: videoSrcHashFixture
            });
            await v.ensureVideoSrcHash();
            expect(v.videoSrcHash).to.equal(videoSrcHashFixture);
        });
    })

    describe('ensureVideo240Hash', function () {
        this.timeout(60000);
        it('should transcode tmpFilePath video to 240p resolution, upload to ipfs and populate video240Hash', async function () {
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mp4Fixture
            });
            await v.ensureVideo240Hash();
            expect(v.video240Hash).to.equal(`${video240HashFixture}?filename=projektmelody-chaturbate-30211016T000000Z-240p.mp4`);
        });
        it('should do nothing if video240Hash already exists', async function () {
            const v = new VOD({
                date: futureDateFixture,
                video240Hash: video240HashFixture
            });
            await v.ensureVideo240Hash();
            expect(v.video240Hash).to.equal(video240HashFixture);
        });
        it('should populate video240HashTmp', async function () {
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mp4Fixture
            });
            await v.ensureVideo240Hash();
            expect(v.video240HashTmp).to.match(/-240p.mp4$/);
        });        
        it('should not throw if tmpFilePath is an mkv', async function () {
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mkvFixture
            });
            expect(v.ensureVideo240Hash).to.not.throw();
        });
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
        });
    });

    describe('uploadToIpfs', function () {
        this.timeout(45000);
        it('should first transcode a mkv to mp4', async function () {
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mkvFixture
            });
            await v.uploadToIpfs();
            expect(v.tmpFilePath).to.match(mp4Regex);
            expect(v.videoSrcHash).to.match(ipfsHashRegex);
        })
        it('should upload a mp4 and save the cid to vod.videoSrcHash', async function () {
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mp4Fixture
            });
            await v.uploadToIpfs();
            console.log(v.videoSrcHash)
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

    describe('_getSafeText', function () {
        it('should urlencode double quotes', function () {
            expect(VOD._getSafeText('Hello "world"')).to.equal("Hello%20%22world%22");
        })
        it('should urlencode asterisks', function () {
            const unsafeMessage = '*this';
            expect(VOD._getSafeText(unsafeMessage)).to.equal("%2athis");
        })
        it('should do nothing if text is already encoded', function () {
            expect(VOD._getSafeText(singleEncodedText)).to.equal(singleEncodedText);
            expect(VOD._getSafeText(doubleEncodedText)).to.equal(doubleEncodedText);
        })
    })

    describe('_containsEncodedComponents', function () {
        it('should detect %2A or %22', function () {
            const wang = 'Updated my bar!!! It looks very cyberpunky (but all the bottles are filled with wang energy drink). %2Athis message sponsored by wang energy drink, %22Taste the Wang%22';
            expect(VOD._containsEncodedComponents(wang)).to.be.true;
        })
    })

    describe('_getTmpDownloadPath', function () {
        it('should return something like /tmp/<filename>.<extension>', function () {
            const dlPath = VOD._getTmpDownloadPath('myfile.txt');
            expect(dlPath).to.equal('/tmp/myfile.txt');
        })
    })

    describe('ensureDate', function () {
        it('should do nothing if date already exists', async function () {
            const v = new VOD({
                date: futureDateFixture
            })
            await v.ensureDate();
            expect(v).to.have.property('date')
            expect(isEqual(v.date, new Date(futureDateFixture))).to.be.true;
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

    describe('ensureTmpFilePath', function() {
        it('should do nothing if ensureTmpFilePath already exists', async function () {
            this.timeout(250);
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mp4Fixture
            });
            await v.ensureTmpFilePath();
            expect(v).to.have.property('tmpFilePath', mp4Fixture);
        })
        it('should reject if neither videoSrc nor videoSrcHash exists', async function () {
            const v = new VOD({
                date: futureDateFixture
            });
            expect(v.ensureTmpFilePath()).to.be.rejectedWith('missing');
        })
        it('should download videoSrcHash and populate tmpFilePath', async function () {
            this.timeout(5000);
            const v = new VOD({
                date: futureDateFixture,
                videoSrcHash: videoSrcHashFixture
            })
            await v.ensureTmpFilePath();
            expect(v).to.have.property('tmpFilePath');
            expect(v.tmpFilePath).to.match(/\.mp4/);
        })
        it('should download videoSrc and populate tmpFilePath', async function () {
            this.timeout(5000);
            const v = new VOD({
                date: futureDateFixture,
                videoSrc: videoSrcFixture
            })
            await v.ensureTmpFilePath();
            expect(v).to.have.property('tmpFilePath');
            expect(v.tmpFilePath).to.match(/\.mp4/);
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
                videoSrc: videoSrcFixture
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
                videoSrc: videoSrcFixture,
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


    describe('ensureThiccHash', function () {
        it('should do nothing if thiccHash already exists', async function () {
            const v = new VOD({
                date: futureDateFixture,
                thiccHash: thiccHashFixture
            })
            await v.ensureThiccHash();
            expect(v.thiccHash).to.equal(thiccHashFixture);
        })
        it('should generate thiccHash using tmpFilePath', async function () {
            this.timeout(60000);
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mp4Fixture
            })
            await v.ensureThiccHash();
            expect(v.thiccHash).to.equal(`${thiccHashFixture}?filename=${v.getSafeDatestamp()}-thicc.jpg`);
        })
        xit('should generate thiccHash using videoSrcHash', async function () {
            // too slow!
            this.timeout(120000);
            const v = new VOD({
                date: futureDateFixture,
                videoSrcHash: videoSrcHashFixture
            })
            await v.ensureThiccHash();
            expect(v.thiccHash).to.equal(`${thiccHashFixture}?filename=${v.getSafeDatestamp()}-thicc.jpg`);
        })
    })

    xdescribe('ensureThinHash', function () {

    })

    describe('generateThumbnail', function () {
        it('should populate thiccHash and thinHash using tmpFilePath', async function () {
            this.timeout(60000);
            const v = new VOD({
                tmpFilePath: mp4Fixture,
                date: futureDateFixture
            });
            await v.generateThumbnail();
            const safeDate = v.getSafeDatestamp();
            expect(v).to.have.property('thiccHash', `${mp4FixtureThiccHash}?filename=${safeDate}-thicc.jpg`);
            expect(v).to.have.property('thinHash', `${mp4FixtureThinHash}?filename=${safeDate}-thin.jpg`);
        });
        it('should populate thiccHash and thinHash using videoSrcHash', async function () {
            this.timeout(400000);
            const v = new VOD({
                videoSrcHash: videoSrcHashFixture,
                date: futureDateFixture
            });
            await v.generateThumbnail();
            const safeDate = v.getSafeDatestamp();
            expect(v).to.have.property('thiccHash', `${mp4FixtureThiccHash}?filename=${safeDate}-thicc.jpg`);
            expect(v).to.have.property('thinHash', `${mp4FixtureThinHash}?filename=${safeDate}-thin.jpg`);
        });
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
                videoSrc: videoSrcFixture
            })
            const method = v.getMethodToEnsureTmpFilePath();
            expect(method).to.be.a('function');
            expect(method).to.have.property('name', 'downloadFromIpfs');
        })
        it('should return {function} downloadFromB2 when videoSrc is available and videoSrcHash is not', function () {
            const v = new VOD({
                videoSrc: videoSrcFixture
            })
            const method = v.getMethodToEnsureTmpFilePath();
            expect(method).to.be.a('function');
            expect(method).to.have.property('name', 'downloadFromB2');
        })
        it('should return null if neither videoSrcHash nor videoSrc exists', function () {
            const v = new VOD({
                date: futureDateFixture
            });
            const b = v.getMethodToEnsureTmpFilePath()
            expect(b).to.be.null;
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
                videoSrc: videoSrcFixture
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
                videoSrc: videoSrcFixture
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

    

    xdescribe('determineNecessaryActionsToEnsureComplete', function () {
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
                videoSrc: videoSrcFixture,
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