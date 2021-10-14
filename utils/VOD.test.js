

import VOD from './VOD.js'

const b2VODFixture = 'https://f000.backblazeb2.com/file/futureporn/projektmelody-chaturbate-2021-10-11.mp4';
const ipfsHashFixture = 'bafybeihbhfz3f6otgivbttvpbnuh5zqumtgmqam55tawr3ku5recviitgq';

describe('VOD', () => {

	describe('downloadFromIPFS', () => {
		it('should download a file to /tmp', async () => {
			const v = new VOD({
				videoSrcHash: ipfsHashFixture
			})
			const { filename } = await v.downloadFromIpfs(ipfsHashFixture);
			expect(filename).toStrictEqual(`/tmp/${ipfsHashFixture}`);
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