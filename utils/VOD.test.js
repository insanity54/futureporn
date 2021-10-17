

import VOD from './VOD.js'
import path from 'path';
import matter from 'gray-matter';
import * as fsp from 'fs/promises';
import { parseISO, isEqual } from 'date-fns';

const pngFixture = path.join(__dirname, './cj_clippy_avatar.png');
const b2VODFixture = 'https://f000.backblazeb2.com/file/futureporn/projektmelody-chaturbate-2021-10-11.mp4';
const ipfsHashFixture = 'bafkreiek3g2fikcwe672ayjeab3atgpmxlyfv32clxfcu5r4xv66iz4nlm';

describe('VOD', () => {

	describe('saveMarkdown', () => {
		it('should accept a {String} URL and save it in the markdown', async () => {
			const note = 'This is not an actual VOD. This is only a test.';
			const date = '3021-10-16';
			const v = new VOD({
				date: date,
				videoSrcHash: b2VODFixture,
				note: note
			})
			const res = await v.saveMarkdown();
			expect(res).toBeInstanceOf(VOD);
			const md = await fsp.readFile(
				path.join(
					__dirname, 
					'..', 
					'website', 
					'vods', 
					`${date}.md`
				),
				{ encoding: 'utf-8' }
			)
			console.log(md)
			const m = matter(md);
			expect(m.data).toHaveProperty('videoSrcHash', b2VODFixture);
			expect(m.data).toHaveProperty('note', note);
			expect(m.data).toHaveProperty('date');
			expect(m.data.date).toBeInstanceOf(Date);
			console.log(`comparing\n${m.data.date} to\n${parseISO(date)}`)
			expect(isEqual(m.data.date, parseISO(date))).toBeTruthy();
		})
	})

	describe('downloadFromIPFS', () => {
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

	describe('getFilename', () => {
		it('should generate a unique filename using the date', () => {
			const v = new VOD({
				date: '2021-10-16'
			})
			const filename = v.getFilename();
			expect(filename).toEqual('projektmelody-chaturbate-2021-10-16.mp4');
		})
		it('should throw if there is no date', () => {
			const v = new VOD({
				date: ''
			})
			expect(() => { v.getFilename() }).toThrow('date');
		})
	})

	describe('uploadToB2', () => {
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

	describe('getTmpDownloadPath', () => {
		it('should return something like /tmp/<filename>.<extension>', () => {
			const dlPath = VOD.getTmpDownloadPath('myfile.txt');
			expect(dlPath).toStrictEqual('/tmp/myfile.txt');
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
		it('should return an error if neither videoSrc nor videoSrcHash exists', () => {
			const v = new VOD({});
			expect(() => {
				v.getMethodToEnsureB2()
			}).toThrow('neither');
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
		it('should return an error if neither videoSrc nor videoSrcHash exists', () => {
			const v = new VOD({});
			expect(() => {
				v.getMethodToEnsureIpfs()
			}).toThrow('neither');
		})
	})


	xdescribe('getMethodToEnsureThumbnail', () => {
		it('should return {function} this.generateThumbnail if thumbnail is missing', () => {
			const v = new VOD({
				videoSrc: ''
			})
			const method = v.getMethodToEnsureThumbnail();
			expect(method).toBeInstanceOf(Function);
			expect(method);
		})
		it('should return null if Thumbnail exists', () => {
			const v = new VOD({
				videoSrc: b2VODFixture
			})
			const method = v.getMethodToEnsureThumbnail();
			expect(method).toBeNull();	
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

	xdescribe('determineNecessaryActionsToEnsureComplete', () => {
		it('should copy an IPFS video to ', () => {

		})
	})
})