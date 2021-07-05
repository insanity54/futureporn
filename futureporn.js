const path = require("path")
const express = require("express")
const favicon = require('serve-favicon')
const cron = require('node-cron')
const globby = require('globby')
const fsp = require('fs').promises
const { parseISO, isBefore, differenceInMilliseconds } = require('date-fns')
const B2 = require('backblaze-b2');
const fs = require('fs')
const axios = require('axios')

const retainDurationMs = 1000 * 60 * 60 * 24 * 14 // 14 days
const app = express()
const publicPath = path.join(__dirname, "public")
const port = process.env.PORT || 5050


const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID, // or accountId: 'accountId'
  applicationKey: process.env.B2_APPLICATION_KEY // or masterApplicationKey
});



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(favicon(path.join(publicPath, 'favicon.ico')))
app.use(express.static(publicPath))




const getListOfVids = async (web) => {
	const vids = await globby(path.join(publicPath), {
		expandDirectories: {
			extensions: ['mp4', 'part']
		}
	})
	let formattedList
	if (web) {
		formattedList = vids.map((v) => { return v.replace(publicPath, '') })
	} else {
		formattedList = vids;
	}
	return formattedList;
}

const getVidBirthTime = async (videoPath) => {
	const stat = await fsp.stat(vid)
	const { birthtime } = stat
	return parseISO(birthtime.toISOString())
}

const isVidOlderThanRetainDuration = async (vid) => {
	const birthtime = await getVidBirthTime(vid)
	const age = differenceInMilliseconds(new Date(), birthtime)
	const isOlder = (age > retainDurationMs)
	return isOlder
}

const deleteVid = async (vidPath) => {
	console.log(`Deleting ${vidPath}`);
	return fsp.unlink(vidPath);
}

const deleteOldVids = async () => {
	const vids = await getListOfVids();
	for (vid of vids) {
		if (await isVidOlderThanRetainDuration(vid)) {
			await deleteVid(vid)
		}
	}
}

const seedTestVideo = async () => {
	const testVideoUrl = 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/av1/360/Big_Buck_Bunny_360_10s_1MB.mp4'
	await axios.get(testVideoUrl)
	  .then(function (response) {
	    response.data.pipe(fs.createWriteStream(path.join(__dirname, 'public', 'test-video.mp4')))
	  });
}

const copyVidsToBackblaze = async () => {



	  try {
		const vids = getListOfVids(false)
	    await b2.authorize(); // must authorize first (authorization lasts 24 hrs)
	    let response = await b2.getBucket({ bucketName: process.env.B2_BUCKET_NAME });
	    console.log(response.data);

	    if (vids.length > 0) {
		    for (vid of vids) {
		    	// get upload url
				const uploadUrlResponse = await b2.getUploadUrl({
				    bucketId: process.env.B2_BUCKET_ID
				});

				let response = await b2.getUploadPartUrl({ fileId });

				let uploadUrl = uploadUrlResponse.data.uploadUrl;
				let authToken = uploadUrlResponse.data.authorizationToken;


				// upload file
				const uploadRes = await b2.uploadFile({
				    uploadUrl: uploadUrl,
				    uploadAuthToken: authToken,
				    fileName: vid,
				    contentLength: 0, // optional data length, will default to data.byteLength or data.length if not provided 
				});

				console.log(uploadRes)
			}
		}

	  } catch (err) {
	    console.error('Error while trying to cpy vids to backblaze');
	    console.error(err);
	  }
	
}

const copySiteToNeocities = async () => {

}

// Every hour, delete videos which are aged >= 2 weeks
cron.schedule('0 0 * * * *', async () => {
	try {
		await deleteOldVids();
	} catch (e) {
		console.error('An Error was encountered while deleting old vids')
		console.error(e);
	}
})

// Every day, copy vods to backblaze
// and futureporn.neocities.org
cron.schedule('0 1 * * * *', async () => {
	try {
		await copyVidsToBackblaze();
		await copySiteToNeocities();
	} catch (e) {
		console.error('An Error was encountered while copying site to neocities')
		console.error(e);
	}
})




app.get('/', async (req, res) => {
	const listOfVids = await getListOfVids(true);
    res.render('index', { videos: listOfVids });
});

app.listen(port, () => {
	console.log(`Futureporn version ${require('./package.json').version}`)
	console.log(`listening on port ${port}`)
	seedTestVideo();
	copyVidsToBackblaze();
});

module.exports = app;