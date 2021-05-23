const path = require("path")
const express = require("express")
const favicon = require('serve-favicon')
const cron = require('node-cron')
const globby = require('globby')
const fsp = require('fs').promises
const { parseISO, isBefore, differenceInMilliseconds } = require('date-fns')

const retainDurationMs = 1000 * 60 * 60 * 24 * 14 // 14 days
const app = express()
const publicPath = path.join(__dirname, "public")
const port = process.env.PORT || 5050


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(favicon(path.join(publicPath, 'favicon.ico')))
app.use(express.static(publicPath))




const getListOfVids = async (web) => {
	const vids = await globby(path.join(publicPath), {
		expandDirectories: {
			extensions: ['mp4']
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


// Every hour, delete videos which are aged >= 2 weeks
cron.schedule('0 0 * * * *', async () => {
	try {
		await deleteOldVids();
	} catch (e) {
		console.error('An Error was encountered while deleting old vids')
		console.error(e);
	}
})





app.get('/', async (req, res) => {
	const listOfVids = await getListOfVids(true);
	console.log(listOfVids)
    res.render('index', { videos: listOfVids });
});

app.listen(port, () => {
	console.log(`Futureporn version ${require('./package.json').version}`)
	console.log(`listening on port ${port}`)
});

module.exports = app;