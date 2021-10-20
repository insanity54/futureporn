

const VOD = require('./VOD.js');
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
			expect(v.getTweetIdFromAnnounceUrl()).toStrictEqual('1272965936685953024');
		})
	})

	describe('getDateFromTwitter', () => {
		it('should reach out to twitter and return the ISO date', async () => {
			const v = new VOD({
				announceUrl: annouceUrlFixture
			})
			await v.getDateFromTwitter();
			expect(v.date).toEqual(new Date('2020-06-16T18:55:04.000Z'));
		})
	})


	describe('default', () => {
		it("should accept '' and return ''", () => {
			expect(VOD.default('')).toStrictEqual('');
		})
		it("should accept 'yolo' and return 'yolo'", () => {
			expect(VOD.default('yolo')).toStrictEqual('yolo');
		})
		it("should accept {Date} and return {Date}", () => {
			const d = new Date();
			expect(VOD.default(d)).toStrictEqual(d);
		})
		it("should accept undefined and return ''", () => {
			expect(VOD.default(undefined)).toStrictEqual('');
		})
	})

	describe('parseDate', () => {
		it('should accept {String} 2021-10-16 and return a Date', () => {
			const d = VOD.parseDate('2021-10-16');
			expect(d).toBeInstanceOf(Date);
			expect(isValid(d)).toBeTruthy();
		})
		it('should accept 2021-10-16T00:00:00.000Z and return a Date', () => {
			const d = VOD.parseDate('2021-10-16T00:00:00.000Z');
			expect(d).toBeInstanceOf(Date);
			expect(isValid(d)).toBeTruthy();
		})
		it("should accept '' and return ''", () => {
			const d = VOD.parseDate('');
			expect(d).toStrictEqual('');
		})
		it("should accept undefined and return ''", () => {
			const d = VOD.parseDate(undefined);
			expect(d).toStrictEqual('');
		})
	})

	describe('getMarkdownFilename', () => {
		it('should return an absolute path with no spaces', () => {
			const v = new VOD({
				date: '3031-10-16T00:00:00.000Z'
			})
			const res = v.getMarkdownFilename();
			expect(typeof res).toEqual('string');
			expect(res).not.toMatch(' ');
			expect(res).toMatch('/futureporn/website/vods/3031-10-16T00:00:00.000Z.md');
			expect(path.isAbsolute(res)).toBeTruthy();
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
			expect(res).toBeInstanceOf(VOD);
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
			expect(m.data).toHaveProperty('videoSrcHash', b2VODFixture);
			expect(m.data).toHaveProperty('note', note);
			expect(m.data).toHaveProperty('date');
			expect(m.data.date).toBeInstanceOf(Date);
			expect(isEqual(m.data.date, parseISO(date))).toBeTruthy();
		})
	})

	xdescribe('downloadFromIPFS', () => {
		it('should download a file to /tmp', async () => {
			const v = new VOD({
				videoSrcHash: ipfsHashFixture
			})
			const res = await v.downloadFromIpfs(ipfsHashFixture);
			expect(res).toHaveProperty('filename');
			expect(res).toHaveProperty('execa');
			expect(res.execa).toHaveProperty('killed', false);
			expect(res.execa).toHaveProperty('exitCode', 0);
			expect(res.filename).toStrictEqual(`/tmp/${ipfsHashFixture}`);
		})
	}, 30*1000)

	describe('getDatestamp', () => {
		it('should return a date in Zulu tz', () => {
			const v = new VOD({ date: '3021-10-16' });
			expect(v.getDatestamp()).toStrictEqual('3021-10-16T00:00:00.000Z');
		})
	})

	describe('getVideoBasename', () => {
		it('should generate a unique filename using the date', () => {
			const v = new VOD({
				date: '3021-10-16T00:00:00.000Z'
			})
			const filename = v.getVideoBasename();
			expect(filename).toEqual('projektmelody-chaturbate-3021-10-16T00:00:00.000Z.mp4');
		})
	})

	// xdescribe('uploadToIpfs', () => {
	// 	// this test is fucked due to some web3.storage issue that I can't get around
	// 	// it's only a problem when invoked via jest
	// 	//     Cannot find module 'ipfs-car/pack' from 'node_modules/web3.storage/dist/src/lib.cjs'
	// 	it('should upload a file and save the cid to vod.videoSrcHash', async () => {
	// 		const v = new VOD({
	// 			tmpFilePath: path.join(__dirname, 'cj_clippy_avatar.png')
	// 		})
	// 		await v.uploadToIpfs();
	// 		expect(v.videoSrcHash).toStrictEqual(thiccHashFixture);
	// 	})
	// })

	xdescribe('uploadToB2', () => {
		it('should upload a file to Backblaze', async () => {
			const v = new VOD({
				date: '2021-10-16',
				tmpFilePath: pngFixture
			})
			const res = await v.uploadToB2();
			expect(res).toBeInstanceOf(VOD);
			expect(res).toHaveProperty('videoSrc');
			expect(res.videoSrc).toMatch(/backblaze2.com\/file\/futureporn\//);
		})
	})

	describe('getSafeText', () => {
		it('should escape double quotes', () => {
			expect(VOD.getSafeText('Hello "world"')).toMatch(/\\"world\\"/);
		})
	})

	describe('getTmpDownloadPath', () => {
		it('should return something like /tmp/<filename>.<extension>', () => {
			const dlPath = VOD.getTmpDownloadPath('myfile.txt');
			expect(dlPath).toStrictEqual('/tmp/myfile.txt');
		})
	})

	describe('getMethodToEnsureDate', () => {
		it('should return {function} this.getDateFromTwitter if date is missing', () => {
			const v = new VOD({
				videoSrcHash: ipfsHashFixture
			})
			const method = v.getMethodToEnsureDate();
			expect(method).toBeInstanceOf(Function);
		})
		it('should return null if date is present', () => {
			const v = new VOD({
				date: '3021-10-16'
			})
			const method = v.getMethodToEnsureDate();
			expect(method).toBeNull();
		})
		it('should return null if zulu date exists', () => {
			const v = new VOD({
				date: '3021-10-16T00:00:00.000Z'
			})
			const method = v.getMethodToEnsureDate();
			expect(method).toBeNull();
		})
	})

	describe('getMethodToEnsureB2', () => {
		it('should return {function} this.copyIpfsToB2 if B2 is missing', () => {
			const v = new VOD({
				videoSrc: '',
				videoSrcHash: ipfsHashFixture
			})
			const method = v.getMethodToEnsureB2();
			expect(method).toBeInstanceOf(Function);
		})
		it('should return null if B2 exists', () => {
			const v = new VOD({
				videoSrc: b2VODFixture,
				videoSrcHash: ipfsHashFixture
			})
			const method = v.getMethodToEnsureB2();
			expect(method).toBeNull();	
		})
		it('should return null if neither videoSrc nor videoSrcHash exists', () => {
			const v = new VOD({});
			expect(v.getMethodToEnsureB2()).toBeNull();
		})
	})

	describe('getIpfsUrl', () => {
		it('should return ipfs.io url', () => {
			const date = '3021-10-16T00:00:00.000Z';
			const v = new VOD({ videoSrcHash: ipfsHashFixture, date: date });
			expect(v.getIpfsUrl()).toStrictEqual(`https://ipfs.io/ipfs/${ipfsHashFixture}?filename=projektmelody-chaturbate-${date}.mp4`)
		})
	})

	describe('getMethodToEnsureIpfs', () => {
		it('should return {function} this.copyB2ToIpfs if ipfs is missing', () => {
			const v = new VOD({
				videoSrcHash: '',
				videoSrc: b2VODFixture
			})
			const method = v.getMethodToEnsureIpfs();
			expect(method).toBeInstanceOf(Function);
		})
		it('should return null if B2 exists', () => {
			const v = new VOD({
				videoSrcHash: ipfsHashFixture
			})
			const method = v.getMethodToEnsureIpfs();
			expect(method).toBeNull();	
		})
		it('should return null if neither videoSrc nor videoSrcHash exists', () => {
			const v = new VOD({});
			expect(v.getMethodToEnsureIpfs()).toBeNull();
		})
	})

	xdescribe('generateThumbnail', () => {});

	describe('getMethodToEnsureThumbnail', () => {
		it('should return {function} this.generateThumbnail if thumbnail is missing', () => {
			const v = new VOD({
				thiccHash: ''
			})
			const method = v.getMethodToEnsureThumbnail();
			expect(method).toBeInstanceOf(Function);
		})
		it('should return null if Thumbnail exists', () => {
			const v = new VOD({
				thiccHash: thiccHashFixture
			})
			const method = v.getMethodToEnsureThumbnail();
			expect(method).toBeNull();	
		})
	})

	describe('hasIpfs', () => {
		it('should return true if vod.videoSrcHash exists', () => {
			const v = new VOD({
				videoSrcHash: ipfsHashFixture
			})
			expect(v.hasIpfs()).toBeTruthy()
		})
		it('should return false if vod.videoSrcHash is empty', () => {
			const v = new VOD({
				videoSrcHash: ''
			})
			expect(v.hasIpfs()).toBeFalsy()
		})
	})

	describe('hasB2', () => {
		it('should return true if VOD.videoSrc exists', () => {
			const v = new VOD({
				videoSrc: b2VODFixture
			})
			expect(v.hasB2()).toBeTruthy()
		})
		it('should return false if VOD.videoSrc is empty', () => {
			const v = new VOD({
				videoSrc: ''
			})
			expect(v.hasB2()).toBeFalsy()
		})
	})

	describe('isMissingZuluDate', () => {
		it('should return false if date is present', () => {
			const v = new VOD({
				date: '3021-10-16T00:00:00.000Z'
			})
			expect(v.isMissingZuluDate()).toBeFalsy();
		});
		it('should return true if date is missing', () => {
			const v = new VOD({});
			expect(v.isMissingZuluDate()).toBeTruthy();
		});
	})


	describe('isMissingB2', () => {
		it('should exist as a class method', () => {
			const v = new VOD({});
			expect(VOD.isMissingB2).toBeUndefined();
			expect(v.isMissingB2).toBeDefined();
		})
		it('should return false if VOD.videoSrc exists', () => {
			const v = new VOD({
				videoSrc: b2VODFixture
			});
			const res = v.isMissingB2();
			expect(res).toBeFalsy();
		})
		it('should return true if VOD.videoSrc does not exist', () => {
			const v = new VOD({
				videoSrc: ''
			});
			const res = v.isMissingB2();
			expect(res).toBeTruthy();
		})
	})

	describe('isMissingThumbnail', () => {
		it('should return false if vod.thiccHash exists', () => {
			const v = new VOD({
				thiccHash: thiccHashFixture
			});
			const res = v.isMissingThumbnail();
			expect(res).toBeFalsy();
		})
		it('should return true if vod.thiccHash does not exist', () => {
			const v = new VOD({
				thiccHash: ''
			});
			const res = v.isMissingThumbnail();
			expect(res).toBeTruthy();
		})
	})

	describe('isMissingIpfs', () => {
		it('should return false if VOD.videoSrcHash exists', () => {
			const v = new VOD({
				videoSrcHash: ipfsHashFixture
			});
			const res = v.isMissingIpfs();
			expect(res).toBeFalsy();
		})
		it('should return true if VOD.videoSrcHash does not exist', () => {
			const v = new VOD({
				videoSrcHash: ''
			});
			const res = v.isMissingIpfs();
			expect(res).toBeTruthy();
		})
	})

	describe('determineNecessaryActionsToEnsureComplete', () => {
		test('Existence of B2 and date, absense of IPFS and thumbnail', () => {
			const v = new VOD({
				videoSrc: b2VODFixture,
				date: new Date()
			})
			const actions = v.determineNecessaryActionsToEnsureComplete();
			console.log(actions)
			expect(actions).toHaveLength(2) // thumbnail and ipfs functions
		})
		test('existence of ipfs and date, absence of b2 and thumbnail', () => {
			const v = new VOD({
				videoSrcHash: ipfsHashFixture,
				date: new Date()
			})
			const actions = v.determineNecessaryActionsToEnsureComplete()
			expect(actions).toHaveLength(2) // thumbnail and ipfs functions
		})
		test('existence of ipfs, absence of b2 and date and thumnail', () => {
			const v = new VOD({
				videoSrcHash: ipfsHashFixture,
			})
			const actions = v.determineNecessaryActionsToEnsureComplete()
			expect(actions).toHaveLength(3) // thumbnail and ipfs and date functions
		})
	})
})