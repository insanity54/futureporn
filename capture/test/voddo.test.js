import 'dotenv/config'
import Voddo from '../src/voddo.js'
import { getRandomRoom } from '../src/cb.js'
import { expect } from 'chai'
import sinon from 'sinon'
import sinonTest from 'sinon-test'
import YoutubeDlWrap from 'youtube-dl-wrap'
import { AbortController } from "node-abort-controller";
import { EventEmitter } from 'events'

let test = sinonTest(sinon)

describe('voddo', function () {
	let room;
	let server;

	before(async function () {
		this.timeout(1000*10)
		// room = await getRandomRoom()
		// server = sinon.fakeServer.create();
	})

	after(function () {
		// server.restore();
	})

	xit('should download a stream', function (done) {
		this.timeout(1000*30)
	  const voddo = new Voddo({
			url: `https://chaturbate.com/projektmelody`,
			format: 'worst',
			cwd: process.env.FUTUREPORN_WORKDIR || '/tmp'

		})
		voddo.once('stop', function (data) {
			console.log('  [test] WE GOT A STOP EVENT!')
			expect(this.abortController.signal.aborted).to.be.true
			done()
		})
		voddo.once('start', function (data) {
			expect(data).to.have.property('file')
			expect(data).to.have.property('timestamp')
			setTimeout(() => { 
				console.log('  [test] sending voddo.stop()')
				this.stop() 
			}, 2000)
		})
		voddo.start()
	})


	it('should retry when a stream closes', function (done) {
		this.timeout(1000*30)

		// let ytdlStub = sinon.createStubInstance(YoutubeDlWrap, {
		// 	exec: sinon.stub().returns()
		// })

		// ytdlwrap is the dependency
		// voddo is the test subject
		// we want to replace ytdlwrap with sinon mock functions

		// actually NOT a spy, because with spies, ytdl.exec still runs.
		// we want to prevent ytdl.exec from running, becasue that
		// fires a fragile network test.
		// 
		// STUB usage
		// 

		// const ytdl = new YoutubeDlWrap()
		const ytdlStub = sinon.createStubInstance(YoutubeDlWrap);
		ytdlStub.exec
			.onCall(0)
				.callsFake(function (args, opts, aborter) {
					console.log('  [test] callsFake 0')
					let ee = new EventEmitter()
					setTimeout(() => {
						ee.emit('youtubeDlEvent', 'download', ' Destination: projektmelody 2023-01-17 19_39-projektmelody.mp4')
					}, 100)
					setTimeout(() => {
						ee.emit('close')
					}, 550)
					return ee
				})
			.onCall(1)
				.callsFake(function (args, opts, aborter) {
					console.log('  [test] callsFake 1')
					let ee = new EventEmitter()
					setTimeout(() => {
						ee.emit('youtubeDlEvent', 'download', ' Destination: projektmelody 2023-01-17 19_45-projektmelody.mp4')
					}, 100)
					return ee
				})
				




		let url = `https://chaturbate.com/projektmelody`
		let cwd = process.env.FUTUREPORN_WORKDIR || '/tmp'
		let abortController = new AbortController()

		const voddo = new Voddo({
			url: url,
			format: 'best',
			cwd: cwd,
			ytdl: ytdlStub
		})

		voddo.once('start', function (data) {
			console.log('  [test] voddo <<<<<-----')
			expect(data).to.have.property('file')
			expect(data).to.have.property('timestamp')


			voddo.once('start', function (data) {
				console.log('  [test] restarted after dl close! (expected) <<<<<-----')

				sinon.assert.calledTwice(ytdlStub.exec)
				done()
			})


		})

		voddo.start()


	})

}) 