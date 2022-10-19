const ipfsClusterUpload = require('../utils/ipfsClusterUpload.js');
const path = require('node:path');

describe('ipfsClusterUpload', () => {
	it('integration', async () => {
		this.timeout(3*60*1000)

		const testAvatarPath = path.join(__dirname, 'cj_clippy_avatar.png');
		const res = await ipfsClusterUpload(testAvatarPath);

		expect(res).toBe('QmZdHWWxQgZdBux8tMDdZdDTqgbumEcHgZWusN69Ko5A3T');
	})
})