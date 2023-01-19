import cheerio from 'cheerio'
import fetch from 'node-fetch'

export async function getRandomRoom () {
	const res = await fetch('https://chaturbate.com/')
	const body = await res.text()
	const $ = cheerio.load(body)
	let roomsRaw = $('a[data-room]')
	let rooms = []
	$(roomsRaw).each((_, e) => {
		rooms.push($(e).attr('href'))
	})

	// greets https://stackoverflow.com/a/4435017/1004931
	var randomIndex = Math.floor(Math.random() * rooms.length);
	return rooms[randomIndex].replaceAll('/', '')
}