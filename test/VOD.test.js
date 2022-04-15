

const chai = require('chai');
const VOD = require('../utils/VOD.js');
const path = require('path');
const matter = require('gray-matter');
const fsp = require('fs/promises');
const { fileURLToPath } = require('url');
const { parseISO, isEqual, isValid } = require('date-fns');
const chaiAsPromised = require('chai-as-promised');
const os = require('os');
const proxyquire = require('proxyquire');

chai.use(chaiAsPromised);


// const __dirname = fileURLToPath(path.dirname(import.meta.url)); // esm workaround for missing __dirname
const pngFixture = path.join(__dirname, './cj_clippy_avatar.png');
const pngFixtureCID = 'bafkreiek3g2fikcwe672ayjeab3atgpmxlyfv32clxfcu5r4xv66iz4nlm';
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
            chai.expect(new VOD({})).to.have.property('tmpFilePath', '')
        })
    })

    describe('getTweetIdFromAnnounceUrl', function () {
        it('should find the tweet ID', function () {
            const v = new VOD({
                announceUrl: annouceUrlFixture
            })
            chai.expect(v.getTweetIdFromAnnounceUrl()).to.equal('1272965936685953024');
        })
    })

    describe('getDateFromTwitter', function () {
        it('should reach out to twitter and return the ISO date', async function () {
            const v = new VOD({
                announceUrl: annouceUrlFixture
            })
            await v.getDateFromTwitter();
            chai.expect(isEqual(v.date, new Date('2020-06-16T18:55:04.000Z'))).to.be.true;
        })
    })


    describe('default', function () {
        it("should accept '' and return ''", function () {
            chai.expect(VOD.default('')).to.equal('');
        })
        it("should accept 'yolo' and return 'yolo'", function () {
            chai.expect(VOD.default('yolo')).to.equal('yolo');
        })
        it("should accept {Date} and return {Date}", function () {
            const d = new Date();
            chai.expect(VOD.default(d)).to.equal(d);
        })
        it("should accept undefined and return ''", function () {
            chai.expect(VOD.default(undefined)).to.equal('');
        })
    })

    describe('parseDate', function () {
        it('should accept {String} 2021-10-16 and return a Date', function () {
            const d = VOD._parseDate('2021-10-16');
            chai.expect(d).to.be.an.instanceof(Date);
            chai.expect(isValid(d)).to.be.true;
        })
        it('should accept 2021-10-16T00:00:00.000Z and return a Date', function () {
            const d = VOD._parseDate('2021-10-16T00:00:00.000Z');
            chai.expect(d).to.be.an.instanceof(Date);
            chai.expect(isValid(d)).to.be.true;
        })
        it("should accept '' and return ''", function () {
            const d = VOD._parseDate('');
            chai.expect(d).to.equal('');
        })
        it("should accept undefined and return ''", function () {
            const d = VOD._parseDate(undefined);
            chai.expect(d).to.equal('');
        })
    })

    describe('getMarkdownFilename', function () {
        it('should return an absolute path with no spaces', function () {
            const v = new VOD({
                date: '3031-10-16T00:00:00.000Z'
            })
            const res = v.getMarkdownFilename();
            chai.expect(typeof res).to.equal('string');
            chai.expect(res).to.match(/\/futureporn\/website\/vods\/30311016T000000Z\.md/);
            chai.expect(path.isAbsolute(res)).to.be.true;
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
            chai.expect(res).to.be.an.instanceof(VOD);
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
            chai.expect(m.data).to.have.property('videoSrcHash', videoSrcFixture);
            chai.expect(m.data).to.have.property('note', note);
            chai.expect(m.data).to.have.property('date');
            chai.expect(m.data).to.have.property('video240Hash');
            chai.expect(m.data).to.have.property('video240TmpFilePath');
            chai.expect(m.data).to.have.property('tmpFilePath');
            chai.expect(m.data.date).to.be.an.instanceof(Date);
            chai.expect(isEqual(m.data.date, parseISO(date))).to.be.true;
        })
    })

    describe('downloadFrom', function () {
        this.timeout(30000)
        it('should download a file to /tmp', async function () {
            const v = new VOD({
                videoSrc: videoSrcFixture,
                date: futureDateFixture
            })
            const res = await v.downloadFromB2(videoSrcFixture);
            const target = '/tmp/projektmelody-chaturbate-30211016T000000Z.mp4';
            chai.expect(v.tmpFilePath).to.equal(target);
            const stat = await fsp.lstat(target);
            chai.expect(stat.size).to.equal(175645);
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
            chai.expect(v.tmpFilePath).to.equal(target);
            const stat = await fsp.lstat(target);
            chai.expect(stat.size).to.equal(202524);
        })
    })

    describe('getDatestamp', function () {
        it('should return a formatted ISO date in Zulu tz', function () {
            const v = new VOD({ date: '3021-10-16' });
            chai.expect(v.getDatestamp()).to.equal('3021-10-16T00:00:00.000Z');
        })
    })


    describe('getSafeDatestamp', function () {
        it('should return a basic formatted ISO date in Zulu tz', function () {
            const v = new VOD({ date: '3021-10-16' });
            chai.expect(v.getSafeDatestamp()).to.equal('30211016T000000Z');
        })
        it('should throw if there is no date', function () {
            const v = new VOD({});
            chai.expect(function() { v.getSafeDatestamp() }).to.throw(/date is missing/);
        })
    })

    describe('_getIpfsHash', () => {
        it('should strip away any query parameters and gateway url leaving only an ipfs hash', () => {
            chai.expect(VOD._getIpfsHash('https://ipfs.io/ipfs/bafybeiay5gbvtseoldxc4hduflzx2tjjqhcry3dyylxa7q47pbobkvu27a?filename=projektmelody-chaturbate-20211112T000700Z.mp4')).to.match(ipfsHashRegex);
        })
    })

    describe('_getVideoBasename', () => {
        it('should generate a unique filename using the date', () => {
            const v = new VOD({
                date: '3021-10-16T00:00:00.000Z'
            })
            const filename = v._getVideoBasename();
            chai.expect(filename).to.equal('projektmelody-chaturbate-30211016T000000Z.mp4');
        })
        it('should accept a {string} parameter and insert it before the file extension', () => {
            const v = new VOD({
                date: '3021-10-16T00:00:00.000Z'
            })
            const filename = v._getVideoBasename('240p');
            chai.expect(filename).to.equal('projektmelody-chaturbate-30211016T000000Z-240p.mp4');  
        })
    })

    xdescribe('_getIpfsHashWithFilename', function () {
        it('should accept a hash as parameter and append filename to the end of hash', function () {
            const v = new VOD({
                date: futureDateFixture
            });
            chai.expect(v._getIpfsHashWithFilename())
        })
    })

    describe('ensureTextFormatting', function () {

        it('should ensure that announceTitle is URL encoded', async function () {
            const v = new VOD({
                date: futureDateFixture,
                announceTitle: notEncodedText
            })
            await v.ensureTextFormatting();
            chai.expect(v).to.have.property('announceTitle', singleEncodedText);
        })
        it('should remove double URL encoding on announceTitle', async function () {
            const v = new VOD({
                date: futureDateFixture,
                announceTitle: doubleEncodedText
            })
            await v.ensureTextFormatting();
            chai.expect(v).to.have.property('announceTitle', singleEncodedText);
        })
        it('should ensure that title is URL encoded', async function () {
            const v = new VOD({
                date: futureDateFixture,
                title: notEncodedText
            })
            await v.ensureTextFormatting();
            chai.expect(v).to.have.property('title', singleEncodedText);
        })
        it('should remove double URL encoding on title', async function () {
            const v = new VOD({
                date: futureDateFixture,
                title: doubleEncodedText
            })
            await v.ensureTextFormatting();
            chai.expect(v).to.have.property('title', singleEncodedText);
        })
        it('should remove double encoding on title with greater than symbols', async function () {
            const doubleEncodedText = 'ass%20kissing%20--------%26gt%3B';
            const singleEncodedText = 'ass kissing -------->';
            const v = new VOD({
                date: futureDateFixture,
                title: doubleEncodedText
            })
            await v.ensureTextFormatting();
            chai.expect(v).to.have.property('title', singleEncodedText);
        })
    })

    describe('ensureVideoSrc', function () {
        this.timeout(1000*60);
        it('should upload an mp4 listed in tmpFilePath to Backblaze and populate videoSrc', async function () {
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mp4Fixture
            })
            await v.ensureVideoSrc();
            chai.expect(v.videoSrc).to.equal(videoSrcFixture);
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
            chai.expect(v.videoSrcHash).to.equal(expectedVideoSrcHash);
        });
        it('should remux an mkv listed in tmpFilePath to mp4, then upload to ipfs and populate videoSrcHash', async function () {
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mkvFixture
            });
            await v.ensureVideoSrcHash();
            chai.expect(v.videoSrcHash).to.equal('bafkreigencclktw34fjka3kebamncvl4wyovwyzn5idntnu5f7iegl3u3u?filename=projektmelody-chaturbate-30211016T000000Z-source.mp4')
        });
        xit('should populate videoSrcHashTmp after remuxing an mkv to mp4', async function () {
            // there is a potential problem where the remux is unecessarily re-done because the previous run of this function exited with error
            // I don't think i want to implement this.
            // the absense of videoSrcHashTmp is only a problem if the program is interrupted
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mkvFixture
            });
            await v.ensureVideoSrcHash();
            chai.expect(v.videoSrcHashTmp).to.match(/\/tmp\/.*.mp4/);
        });
        it('should do nothing if videoSrcHash already exists', async function () {
            const v = new VOD({
                date: futureDateFixture,
                videoSrcHash: videoSrcHashFixture
            });
            await v.ensureVideoSrcHash();
            chai.expect(v.videoSrcHash).to.equal(videoSrcHashFixture);
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
            chai.expect(v.video240Hash).to.equal(`${video240HashFixture}?filename=projektmelody-chaturbate-30211016T000000Z-240p.mp4`);
        });
        it('should do nothing if video240Hash already exists', async function () {
            const v = new VOD({
                date: futureDateFixture,
                video240Hash: video240HashFixture
            });
            await v.ensureVideo240Hash();
            chai.expect(v.video240Hash).to.equal(video240HashFixture);
        });
        it('should populate video240HashTmp', async function () {
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mp4Fixture
            });
            await v.ensureVideo240Hash();
            chai.expect(v.video240HashTmp).to.match(/-240p.mp4$/);
        });        
        it('should not throw if tmpFilePath is an mkv', async function () {
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mkvFixture
            });
            chai.expect(v.ensureVideo240Hash).to.not.throw();
        });
    })

    describe('remuxVideo', function () {
        this.timeout(60000);
        it('should remux a mkv listed in VOD.tmpFilePath and then overwrite VOD.tmpFilePath with the mp4', async function () {
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mkvFixture
            });
            await v.encodeVideo();
            chai.expect(v.tmpFilePath).to.match(mp4Regex);
        });
        it('should do nothing when the VOD.tmpFilePath video is already an mp4', async function () {
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mp4Fixture
            })
            await v.encodeVideo();
            chai.expect(v.tmpFilePath).to.equal(mp4Fixture);
        });
    });

    describe('uploadToIpfs', function () {
        this.timeout(45000);
        it('should throw if the machine has less than 16GB of RAM', async function () {
            let osStub = {};
            let MockedVOD = proxyquire('../utils/VOD.cjs', { os: osStub });
            osStub.totalmem = function () {
                return 16106130000 // 15GB
            }
            const v = new MockedVOD({
                date: futureDateFixture,
                tmpFilePath: mp4Fixture
            });
            chai.expect(v.uploadToIpfs()).to.be.rejectedWith('RAM')
        })
        it('should first remux a mkv to mp4', async function () {
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mkvFixture
            });
            await v.uploadToIpfs();
            chai.expect(v.tmpFilePath).to.match(mp4Regex);
            chai.expect(v.videoSrcHash).to.match(ipfsHashRegex);
        })
        it('should upload a mp4 and save the cid to vod.videoSrcHash', async function () {
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mp4Fixture
            });
            await v.uploadToIpfs();
            console.log(v.videoSrcHash)
            chai.expect(v.videoSrcHash).to.match(ipfsHashRegex); 
        })
    })

    xdescribe('uploadToB2', function () {
        it('should upload a file to Backblaze', async function () {
            const v = new VOD({
                date: '2021-10-16',
                tmpFilePath: pngFixture
            })
            const res = await v.uploadToB2();
            chai.expect(res).to.be.an.instanceof(VOD);
            chai.expect(res).to.have.property('videoSrc');
            chai.expect(res.videoSrc).to.match(/backblaze2.com\/file\/futureporn\//);
        })
    })

    describe('_getSafeText', function () {
        it('should urlencode double quotes', function () {
            chai.expect(VOD._getSafeText('Hello "world"')).to.equal("Hello%20%22world%22");
        })
        it('should urlencode asterisks', function () {
            const unsafeMessage = '*this';
            chai.expect(VOD._getSafeText(unsafeMessage)).to.equal("%2athis");
        })
        it('should urlencode greaterthan symbols', function () {
            const unsafeMessage = '---->';
            chai.expect(VOD._getSafeText(unsafeMessage)).to.equal("----%3E")
        })
        it('should do nothing if text is already encoded', function () {
            chai.expect(VOD._getSafeText(singleEncodedText)).to.equal(singleEncodedText);
            chai.expect(VOD._getSafeText(doubleEncodedText)).to.equal(doubleEncodedText);
        })
    })

    describe('fixedEncodeURIComponent', function () {
        it('should not detect &gt;', function () {
            chai.expect(VOD.fixedEncodeURIComponent('&gt;')).to.equal('&gt;');
        })
    })

    describe('_containsEncodedComponents', function () {
        it('should detect %2A or %22', function () {
            const wang = 'Updated my bar!!! It looks very cyberpunky (but all the bottles are filled with wang energy drink). %2Athis message sponsored by wang energy drink, %22Taste the Wang%22';
            chai.expect(VOD._containsEncodedComponents(wang)).to.be.true;
        })
        it('should detect greater than symbols', function () {
            const wang = 'ass%20kissing%20--------%26gt%3B';
            chai.expect(VOD._containsEncodedComponents(wang)).to.be.true;
        })
        it('should detect &gt;', function () {
            const wang = '&gt;'
            chai.expect(VOD._containsEncodedComponents(wang)).to.be.true;
        })
    })

    describe('_getTmpDownloadPath', function () {
        it('should return something like /tmp/<filename>.<extension>', function () {
            const dlPath = VOD._getTmpDownloadPath('myfile.txt');
            chai.expect(dlPath).to.equal('/tmp/myfile.txt');
        })
    })

    describe('ensureAnnounceUrl', function () {
        it('should throw an error if there is no announceUrl', async function () {
            const v = new VOD({ date: futureDateFixture });
            chai.expect(v.ensureAnnounceUrl).to.throw();
        });
        xit('should find the most recent tweet containing a chaturbate link and use that link')
    })

    describe('ensureAnnounceTitle', function () {
        it('should derive a title from the announcement tweet', async function () {
            const v = new VOD({ 
                date: futureDateFixture,
                announceUrl: 'https://twitter.com/ProjektMelody/status/1343698295563153408'
            });
            await v.ensureAnnouceTitle();
            chai.expect(v.announceTitle).to.be('don%27t%20look%20chat%21%20I%20feel%20shy%21%21%20XD');
        });
        it('should throw if VOD.announceUrl is missing', async function () {
            const v = new VOD({ date: futureDateFixture });
            chai.expect(v.ensureAnnounceUrl).to.throw();
        })
    })

    describe('ensureDate', function () {
        it('should do nothing if date already exists', async function () {
            const v = new VOD({
                date: futureDateFixture
            })
            await v.ensureDate();
            chai.expect(v).to.have.property('date')
            chai.expect(isEqual(v.date, new Date(futureDateFixture))).to.be.true;
        })
    })

    describe('getMethodToEnsureDate', function () {
        it('should return {function} this.getDateFromTwitter if date is missing', function () {
            const v = new VOD({
                videoSrcHash: ipfsHashFixture
            })
            const method = v.getMethodToEnsureDate();
            chai.expect(method).to.be.an.instanceof(Function);
        })
        it('should return null if date is present', function () {
            const v = new VOD({
                date: '3021-10-16'
            })
            const method = v.getMethodToEnsureDate();
            chai.expect(method).to.be.null;
        })
        it('should return null if zulu date exists', function () {
            const v = new VOD({
                date: '3021-10-16T00:00:00.000Z'
            })
            const method = v.getMethodToEnsureDate();
            chai.expect(method).to.be.null;
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
            chai.expect(v).to.have.property('tmpFilePath', mp4Fixture);
        })
        it('should reject if neither videoSrc nor videoSrcHash exists', async function () {
            const v = new VOD({
                date: futureDateFixture
            });
            chai.expect(v.ensureTmpFilePath()).to.be.rejectedWith('missing');
        })
        it('should download videoSrcHash and populate tmpFilePath', async function () {
            this.timeout(5000);
            const v = new VOD({
                date: futureDateFixture,
                videoSrcHash: videoSrcHashFixture
            })
            await v.ensureTmpFilePath();
            chai.expect(v).to.have.property('tmpFilePath');
            chai.expect(v.tmpFilePath).to.match(/\.mp4/);
        })
        it('should download videoSrc and populate tmpFilePath', async function () {
            this.timeout(5000);
            const v = new VOD({
                date: futureDateFixture,
                videoSrc: videoSrcFixture
            })
            await v.ensureTmpFilePath();
            chai.expect(v).to.have.property('tmpFilePath');
            chai.expect(v.tmpFilePath).to.match(/\.mp4/);
        })
    })





    describe('getIpfsUrl', function () {
        it('should return ipfs.io url', function () {
            const date = '30211016T000000Z';
            const v = new VOD({ videoSrcHash: ipfsHashFixture, date: date });
            chai.expect(v.getIpfsUrl()).to.equal(`https://ipfs.io/ipfs/${ipfsHashFixture}?filename=projektmelody-chaturbate-${date}.mp4`)
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
            chai.expect(v.getMethodsToEnsureIpfs()).to.be.a('array');
        })
        it('should return an empty array if ipfs already exists', function () {
            const v = new VOD({
                videoSrcHash: ipfsHashFixture
            });
            const methods = v.getMethodsToEnsureIpfs();
            chai.expect(methods).to.be.a('array');
            chai.expect(methods).to.have.lengthOf(0);
        })
        it('should return an array with {function} downloadFromB2, encodeVideo, and uploadToIpfs if only videoSrc exists', function () {
            const v = new VOD({
                videoSrc: videoSrcFixture,
                date: futureDateFixture
            })
            const methods = v.getMethodsToEnsureIpfs();
            chai.expect(methods[0]).to.have.property('name', 'downloadFromB2');
            chai.expect(methods[1]).to.have.property('name', 'encodeVideo');
            chai.expect(methods[2]).to.have.property('name', 'uploadToIpfs');
        })
        it('should return an empty array if neither videoSrc nor tmpFilePath exists', function () {
            const v = new VOD({});
            const methods = v.getMethodsToEnsureIpfs();
            chai.expect(methods).to.be.a('array');
            chai.expect(methods).to.have.lengthOf(0);
        })
        it('should return an arrray with {function} uploadToIpfs if tmpFilePath contains an mp4', function () {
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mp4Fixture
            });
            const methods = v.getMethodsToEnsureIpfs();
            chai.expect(methods).to.be.a('array');
            chai.expect(methods[0]).to.be.a('function');
            chai.expect(methods[0]).to.have.property('name', 'uploadToIpfs');
        })
        it('should return an arrray with {function} encodeVideo and {function} uploadToIpfs if tmpFilePath contains a mkv', function () {
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mkvFixture
            });
            const methods = v.getMethodsToEnsureIpfs();
            chai.expect(methods).to.be.a('array');
            chai.expect(methods[0]).to.be.a('function');
            chai.expect(methods[0]).to.have.property('name', 'encodeVideo');
            chai.expect(methods[1]).to.be.a('function');
            chai.expect(methods[1]).to.have.property('name', 'uploadToIpfs');
        })
    })


    describe('ensureThiccHash', function () {
        it('should do nothing if thiccHash already exists', async function () {
            this.timeout(1000);
            const v = new VOD({
                date: futureDateFixture,
                thiccHash: thiccHashFixture
            })
            await v.ensureThiccHash();
            chai.expect(v.thiccHash).to.equal(thiccHashFixture);
        })
        it('should generate thiccHash using tmpFilePath', async function () {
            this.timeout(60000);
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mp4Fixture
            })
            await v.ensureThiccHash();
            chai.expect(v.thiccHash).to.equal(`${thiccHashFixture}?filename=${v.getSafeDatestamp()}-thicc.jpg`);
        })
        it('should throw an error if tmpFilePath doesnt exist', async function () {
            // this is temporary to increase speed.
            // @todo delete this test spec and implement the next spec
            //       maybe add a test mock so testing is quick
            //       see issue #9
            const v = new VOD({
                date: futureDateFixture
            })

            await chai.expect(v.ensureThiccHash()).to.be.rejectedWith('UNSUPPORTED')
            // await expect(fails()).to.be.rejectedWith(Error)

        })
        xit('should generate thiccHash using videoSrcHash', async function () {
            // it's slow but this is strictly what I want this function to do...
            // download the video from B2 if its not already local
            // see issue #9
            this.timeout(120000);
            const v = new VOD({
                date: futureDateFixture,
                videoSrcHash: videoSrcHashFixture
            })
            await v.ensureThiccHash();
            chai.expect(v.thiccHash).to.equal(`${thiccHashFixture}?filename=${v.getSafeDatestamp()}-thicc.jpg`);
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
            chai.expect(v).to.have.property('thiccHash', `${mp4FixtureThiccHash}?filename=${safeDate}-thicc.jpg`);
            chai.expect(v).to.have.property('thinHash', `${mp4FixtureThinHash}?filename=${safeDate}-thin.jpg`);
        });
    });

    describe('getMethodToEnsureEncode', function () {
        it('should return {function} encodeVideo if tmpFilePath contains an mkv', function () {
            const v = new VOD({
                tmpFilePath: mkvFixture
            })
            const method = v.getMethodToEnsureEncode();
            chai.expect(method).to.be.an.instanceof(Function);
            chai.expect(method).to.have.property('name', 'encodeVideo');
        })
        it('should return null if tmpFilePath contains an mp4', function () {
            const v = new VOD({
                tmpFilePath: mp4Fixture
            })
            const method = v.getMethodToEnsureEncode();
            chai.expect(method).to.be.null;  
        })
    })

    describe('getMethodToEnsureTmpFilePath', function () {
        it('should return {function} downloadFromIpfs if tmpFilePath is missing and videoSrcHash exists', function () {
            const v = new VOD({
                videoSrcHash: ipfsHashFixture
            })
            const method = v.getMethodToEnsureTmpFilePath();
            chai.expect(method).to.be.a('function');
            chai.expect(method).to.have.property('name', 'downloadFromIpfs');
        })
        it('should prefer downloadFromIpfs over downloadFromB2', function () {
            const v = new VOD({
                videoSrcHash: ipfsHashFixture,
                videoSrc: videoSrcFixture
            })
            const method = v.getMethodToEnsureTmpFilePath();
            chai.expect(method).to.be.a('function');
            chai.expect(method).to.have.property('name', 'downloadFromIpfs');
        })
        it('should return {function} downloadFromB2 when videoSrc is available and videoSrcHash is not', function () {
            const v = new VOD({
                videoSrc: videoSrcFixture
            })
            const method = v.getMethodToEnsureTmpFilePath();
            chai.expect(method).to.be.a('function');
            chai.expect(method).to.have.property('name', 'downloadFromB2');
        })
        it('should return null if neither videoSrcHash nor videoSrc exists', function () {
            const v = new VOD({
                date: futureDateFixture
            });
            const b = v.getMethodToEnsureTmpFilePath()
            chai.expect(b).to.be.null;
        })
    })

    describe('getMethodToEnsureThumbnail', function () {
        it('should return {function} this.generateThumbnail if thumbnail is missing', function () {
            const v = new VOD({
                thiccHash: ''
            })
            const method = v.getMethodToEnsureThumbnail();
            chai.expect(method).to.be.an.instanceof(Function);
        })
        it('should return null if Thumbnail exists', function () {
            const v = new VOD({
                thiccHash: thiccHashFixture
            })
            const method = v.getMethodToEnsureThumbnail();
            chai.expect(method).to.be.null;  
        })
    })

    describe('hasIpfs', function () {
        it('should return true if vod.videoSrcHash exists', function () {
            const v = new VOD({
                videoSrcHash: ipfsHashFixture
            })
            chai.expect(v.hasIpfs()).to.be.true
        })
        it('should return false if vod.videoSrcHash is empty', function () {
            const v = new VOD({
                videoSrcHash: ''
            })
            chai.expect(v.hasIpfs()).to.be.false
        })
    })

    describe('hasTmpFilePath', function () {
        it('should return true if VOD.tmpFilePath exists', function () {
            const v = new VOD({
                tmpFilePath: '/tmp/mycoolfile.fake'
            })
            const res = v.hasTmpFilePath()
            chai.expect(res).to.be.true
        })
        it('should return false if VOD.tmpFilePath is empty', function () {
            const v = new VOD({
                tmpFilePath: ''
            })
            chai.expect(v.hasTmpFilePath()).to.be.false
        })
    })

    describe('isTmpFilePathMkv', function () {
        it('should return true when mkv', function () {
            const v = new VOD({
                tmpFilePath: mkvFixture
            })
            const res = v.isTmpFilePathMkv()
            chai.expect(res).to.be.true
        })
        it('should return false when mp4', function () {
            const v = new VOD({
                tmpFilePath: mp4Fixture
            })
            chai.expect(v.isTmpFilePathMkv()).to.be.false
        })
    })

    describe('isMissingTmpFilePath', function () {
        it('should return false if date is present', function () {
            const v = new VOD({
                tmpFilePath: '/tmp/mycoolfile.fake'
            })
            chai.expect(v.isMissingTmpFilePath()).to.be.false;
        });
        it('should return true if date is missing', function () {
            const v = new VOD({});
            chai.expect(v.isMissingTmpFilePath()).to.be.true;
        });
    })

    describe('hasB2', function () {
        it('should return true if VOD.videoSrc exists', function () {
            const v = new VOD({
                videoSrc: videoSrcFixture
            })
            chai.expect(v.hasB2()).to.be.true
        })
        it('should return false if VOD.videoSrc is empty', function () {
            const v = new VOD({
                videoSrc: ''
            })
            chai.expect(v.hasB2()).to.be.false
        })
    })

    describe('isMissingZuluDate', function () {
        it('should return false if date is present', function () {
            const v = new VOD({
                date: futureDateFixture
            })
            chai.expect(v.isMissingZuluDate()).to.be.false;
        });
        it('should return true if date is missing', function () {
            const v = new VOD({});
            chai.expect(v.isMissingZuluDate()).to.be.true;
        });
    })


    describe('isMissingB2', function () {
        it('should exist as a class method', function () {
            const v = new VOD({});
            chai.expect(VOD.isMissingB2).to.be.undefined
            chai.expect(v.isMissingB2).to.not.be.undefined
        })
        it('should return false if VOD.videoSrc exists', function () {
            const v = new VOD({
                videoSrc: videoSrcFixture
            });
            const res = v.isMissingB2();
            chai.expect(res).to.be.false;
        })
        it('should return true if VOD.videoSrc does not exist', function () {
            const v = new VOD({
                videoSrc: ''
            });
            const res = v.isMissingB2();
            chai.expect(res).to.be.true;
        })
    })

    describe('isMissingThumbnail', function () {
        it('should return false if vod.thiccHash exists', function () {
            const v = new VOD({
                thiccHash: thiccHashFixture
            });
            const res = v.isMissingThumbnail();
            chai.expect(res).to.be.false;
        })
        it('should return true if vod.thiccHash does not exist', function () {
            const v = new VOD({
                thiccHash: ''
            });
            const res = v.isMissingThumbnail();
            chai.expect(res).to.be.true;
        })
    })

    describe('isMissingIpfs', function () {
        it('should return false if VOD.videoSrcHash exists', function () {
            const v = new VOD({
                videoSrcHash: ipfsHashFixture
            });
            const res = v.isMissingIpfs();
            chai.expect(res).to.be.false;
        })
        it('should return true if VOD.videoSrcHash does not exist', function () {
            const v = new VOD({
                videoSrcHash: ''
            });
            const res = v.isMissingIpfs();
            chai.expect(res).to.be.true;
        })
    })

    

    xdescribe('determineNecessaryActionsToEnsureComplete', function () {
        it('should handle a missing date', function () {
            const v = new VOD({
                announceUrl: 'https://twitter.com/ProjektMelody/status/1225922638687752192'
            })
            const actions = v.determineNecessaryActionsToEnsureComplete();
            for (const action of actions) chai.expect(action).to.be.a('function');
            chai.expect(actions[0]).to.have.property('name', 'getDateFromTwitter');
        })
        it('should handle when only videoSrc and date exists', function () {
            const v = new VOD({
                videoSrc: videoSrcFixture,
                date: futureDateFixture
            })
            const actions = v.determineNecessaryActionsToEnsureComplete();
            for (const action of actions) chai.expect(action).to.be.a('function');
            chai.expect(actions[0]).to.have.property('name', 'downloadFromB2');
            chai.expect(actions[1]).to.have.property('name', 'generateThumbnail');
            chai.expect(actions[2]).to.have.property('name', 'uploadToIpfs');
        })
        it('should handle when tmpFilePath exists and is an mp4', function () {
            const v = new VOD({
                tmpFilePath: path.join(__dirname, 'testvid.mp4')
            })
            const actions = v.determineNecessaryActionsToEnsureComplete();
            for (const action of actions) chai.expect(action).to.be.a('function');
            chai.expect(actions[1]).to.have.property('name', 'generateThumbnail');
            chai.expect(actions[2]).to.have.property('name', 'uploadToIpfs');
        })
        it('should handle when tmpFilePath exists and is an mkv', function () {
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: path.join(__dirname, 'testvid.mkv')
            })
            const actions = v.determineNecessaryActionsToEnsureComplete();
            for (const action of actions) chai.expect(action).to.be.a('function');
            chai.expect(actions[0]).to.have.property('name', 'encodeVideo');
            chai.expect(actions[1]).to.have.property('name', 'generateThumbnail');
            chai.expect(actions[2]).to.have.property('name', 'uploadToIpfs');
        })
        it('should handle when only videoSrcHash exists', function () {
            const v = new VOD({
                videoSrcHash: ipfsHashFixture,
            })
            const actions = v.determineNecessaryActionsToEnsureComplete()
            for (const action of actions) chai.expect(action).to.be.a('function');
            chai.expect(actions[0]).to.have.property('name', 'getDateFromTwitter');
            chai.expect(actions[1]).to.have.property('name', 'downloadFromIpfs');
            chai.expect(actions[2]).to.have.property('name', 'generateThumbnail');
            chai.expect(actions[3]).to.have.property('name', 'uploadToB2');
        })
        it('should handle when tmpFilePath exists, and videoSrcHash does not', function () {
            const v = new VOD({
                date: futureDateFixture,
                tmpFilePath: mp4Fixture,
            })
            const actions = v.determineNecessaryActionsToEnsureComplete()
            chai.expect(actions[0]).to.be.a('function');
            chai.expect(actions[1]).to.be.a('function');
            chai.expect(actions[0]).to.have.property('name', 'generateThumbnail');
            chai.expect(actions[1]).to.have.property('name', 'uploadToIpfs');
        })
    })

    describe('_B2Upload', function () {
        it('should upload a file to B2 and return the URL of the file', async function () {
            this.timeout(69000);
            const url = await VOD._B2Upload(pngFixture);
            chai.expect(url).to.equal('https://f000.backblazeb2.com/file/futureporn/cj_clippy_avatar.png');
        })
    })

    describe('_ipfsUpload', function () {
        it('should upload a file to web3 and return an object containing a CID', async function () {
            this.timeout(60000);
            console.log(pngFixture)
            const v = new VOD({ date: futureDateFixture });
            const cid = await v._ipfsUpload(pngFixture);
            chai.expect(cid).to.equal(pngFixtureCID);
        })
    })

    describe('_getBranchHash', function () {
        it('should fetch the CID of the first file in a content archive', async function () {
            this.timeout(60000);
            const v = new VOD({ date: futureDateFixture });
            const cid = await VOD._getBranchHash('bafybeig6xsdyaph7awkzixrjcpdkq4m75muybebrcih5lpss3skkrsheum');
            chai.expect(cid).to.equal('bafybeihggyg54iqrjsvcmrnihwoq54xtqkpznnsao47nhwopmkcmnslv5a');
        })
    })
})