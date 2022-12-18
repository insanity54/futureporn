const { Voddo } = require('./voddo');
const EventEmitter = require('events');
const { Subscriber, Observable } = require('rxjs');
const { TestScheduler } = require('rxjs/testing')
const jest = require('jest');
const download = require('../lib/download');


const sampleOutput2 = `[Chaturbate] projektmelody: Downloading webpage
[Chaturbate] projektmelody: Downloading m3u8 information
[download] Destination: projektmelody 2021-01-12 23_04-projektmelody.mp4

[ffmpeg] Downloaded 7927507368 bytes

[download] 100% of 7.38GiB in 02:27:46`;

const sampleOutput1 = `[twitch:stream] dj_crispy: Downloading stream GraphQL
[twitch:stream] dj_crispy: Downloading stream access token GraphQL
[twitch:stream] 41306468110: Downloading m3u8 information
[download] Destination: dj_crispy (live) 2021-01-13 20_19-41306468110.mp4
[ffmpeg] Downloaded 7301793 bytes
[download] 100% of 6.96MiB in 01:07`;

mockDl = (url) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      var notRandomNumbers = [1, 1, 1, fakePath];
      var idx = Math.floor(Math.random() * notRandomNumbers.length);
      resolve(notRandomNumbers[idx]);
    }, 1000);
  })
};

// mockFFmpeg = jest.fn(() => {
//   return sampleOutput1
// })



jest.useFakeTimers()

jest.mock('youtube-dl-wrap', () => ({
  const events = require('events')
  const ee = new EventEmitter()
  ee.emit = jest.fn()
  return {
    exec: jest.fn().mockImplementation((params) => {
      return ee
    })
  }
})


describe('voddo', () => {
  let testScheduler
  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      return expect(actual).toEqual(expected);
    });
  });


  describe('inputs', () => {
    test('idempotent start -- voddo should be able to receive a signal to immediately start downloading (idempotency-- ignored if already started)', () => {
      const voddo = new Voddo({ url: 'https://twitch.tv/nihmune', format: 'worst', outputFile: '/tmp/my-stream.mp4' })
      voddo.
    })
  })

  describe('outputs', () => {
    test('downloading signal -- voddo should send a signal that it is downloading', () => {
      
    })
    test('complete signal-- voddo should send a signal that it is downloading', () => {
      
    })
  })

  describe('observe', () => {

    test('mocking', () => {
      ytdl.exec.mock


      const voddo = new Voddo({ url: 'https://twitch.tv/nihmune' });
      const w = voddo.observe();
      expect(mockFFmpeg.mock.calls.length).toBe(1);
    })


    xtest('should return an event emitter', () => {
      const voddo = new Voddo({ url: 'https://twitch.tv/nihmune' });
      const w = voddo.observe();
      expect(w).toBeInstanceOf(EventEmitter);
      w.close()
    }, 60000)
    test('should idk be a baller', () => {
      const voddo = new Voddo({ format: 'worst', url: 'https://twitch.tv/apricot' });
      const sub = voddo.observe()
      expect(sub).toBeInstanceOf(Subscriber)
    })
  })
  xdescribe('parseOutput', () => {
    test('should accept the {String} output from ffmpeg (stdout) and return a {String} filename', () => {
      const output1 = voddo.parseOutput(sampleOutput1);
      expect(output1).toBe('dj_crispy (live) 2021-01-13 20_19-41306468110.mp4');
      const output2 = voddo.parseOutput(sampleOutput2);
      expect(output2).toBe('projektmelody 2021-01-12 23_04-projektmelody.mp4');
    });
    test('should throw an error if the received ffmpeg output does not have a destination filename in it', () => {
      expect(() => { voddo.parseOutput('blah') }).toThrow(/filename could not be found/);
    })
  })
})
