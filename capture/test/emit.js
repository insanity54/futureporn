import "dotenv/config";
import aedesClientFactory from '../src/aedes.js'



const aedesClient = aedesClientFactory(
	process.env.AEDES_HOST,
	process.env.AEDES_USERNAME,
	process.env.AEDES_PASSWORD
)

aedesClient.on('connect', (idk) => {
	// console.log(`  [*] topic:${idk.topic} (connected)`)
	console.log(idk)
	aedesClient.subscribe('futureporn/scout/tweet', (err) => {
		if (err) {
			console.error(err)
		} else {
			aedesClient.publish('futureporn/scout/tweet', JSON.stringify({ blah: "blah" }));
		}
	})
});