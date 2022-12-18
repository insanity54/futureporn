const jest = require('jest');
const download = require('../lib/download');
const ytdl = require('youtube-dl-wrap');

jest.mock('../lib/download', () => {
  const events = require('node:events')
  const ee = new EventEmitter()
  return ee
})

describe('download', () => {
  test('simulate download events', () => {
    setTimeout(() => download.emit('twitch:stream', 'nihmune: Downloading stream GraphQL +417ms'), 417)
    setTimeout(() => download.emit('twitch:stream', 'nihmune: Downloading stream access token GraphQL +308ms'), 725)
    setTimeout(() => download.emit('twitch:stream', '41489791179: Downloading m3u8 information +253ms'), 978)
    setTimeout(() => download.emit('download', 'Destination: /tmp/1668224695934.mp4 +278ms'), 1256)
    setTimeout(() => download.emit('ffmpeg', 'Downloaded 27738066 bytes +1m'), 61256)
    setTimeout(() => download.emit('download', '100% of 26.45MiB in 01:13 +0ms'), 61256)

    
    jest.advanceTimersByTime(417)
    expect(download)
    ytdl.emit('twitch:stream', 'nihmune: Downloading stream GraphQL +417ms')

    jest.advanceTimersByTime(308)
    ytdl.emit()

    jest.advanceTimersByTime(253)
    ytdl.emit('', )

    jest.advanceTimersByTime(278)
    ytdl.emit('download''download''download''download''download', )

    jest.advanceTimersByTime(60000)
    ytdl.emit(, )

    jest.advanceTimersByTime(0)
    ytdl.emit(, )    
  })


  test('resume download after network outage', () => {
    setTimeout(() => download.emit('twitch'))
  })
})