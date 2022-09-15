const ipfsClusterUpload = require('../utils/ipfsClusterUpload.js');
const path = require('node:path');

describe('ipfsClusterUpload', () => {
	jest.setTimeout(3*60*1000)
	test('integration', async () => {


		const testAvatarPath = path.join(__dirname, 'cj_clippy_avatar.png');
		const res = await ipfsClusterUpload(testAvatarPath);

		expect(res).toBe('QmZdHWWxQgZdBux8tMDdZdDTqgbumEcHgZWusN69Ko5A3T');
	})
})