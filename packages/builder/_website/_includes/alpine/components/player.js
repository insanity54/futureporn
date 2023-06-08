import videojs from '@mux/videojs-kit/dist/index.vhs.js';
// import Plyr from 'plyr';

import { defineCustomElements } from 'vidstack/elements';




export default function player () {
  return {
    hasMux: false,
    hasIpfs: false,
    muxPlaybackId: '',
    videoSrcHash: '',
    videoSrc240Hash: '',
    preference: this.$persist('public'),
    errors: [],
    playbackToken: '',
    thumbnailToken: '',
    backend: '',
    videoDate: '',
    publicPlayer: null,
    muxEnvKey: 'bmvsfoe2j5d6655ad9g6u82ls',
    isIssueReported: false,
    // isPlayerSelector () {
    //   return (
    //     this.hasMux &&
    //     Alpine.store('auth').jwt !== ''
    //   )
    // },
    isPatronPlayer () {
      return (
        Alpine.store('auth').jwt !== '' &&
        this.hasMux && 
        this.preference === 'patron'
      )
    },
    isPublicPlayer () {
      return this.hasIpfs && (
        !this.hasMux ||
        Alpine.store('auth').jwt === '' ||
        this.preference === 'public'
      )
    },
    loadVidstack () {

    },
    createIssue (type) {
      if (this.isIssueReported) return; // ensure only 1 issue per visit
      fetch(`${this.backend}/api/issues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            type: type,
            sla: Alpine.store('user').role,
            url: window.location.pathname
          }
        })
      }).then(() => {
        this.isIssueReported = true
      })
    },
    async init () {



      // // defineCustomElements();
      // // this.loadVidstack()
      // this.vidstackPlayer = document.querySelector('media-player');
      // this.vidstackPlayer.onAttach(async () => {
        
      // })


      // console.log(player)

      // this.vidstackPlayer.addEventListener('source-change', (event) => {
      //   const newSource = event.detail;
      //   console.log(`@source-change !!! newSource:${newSource}`)
        
      // });




      // this.vidstackPlayer.addEventListener('provider-setup', (event) => {
      //   const provider = event.detail;
      //   if (provider?.type === 'video') {
      //     provider.video; // `HTMLVideoElement`
      //   }
      // });

      // this.vidstackPlayer.addEventListener('loaded-metadata', (event) => {
      //   // Available on all media events!
      //   const target = event.trigger?.target;
      //   if (target instanceof HTMLVideoElement) {
      //     target; // HTMLVideoElement
      //   }
      // });

      // player.onAttach(async () => {
        // // Audio
        // const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // // If we don't set the `type` it will be passed to the video provider.
        // player.src = [{ src: audioStream, type: 'audio/object' }];


      // });

      // Thanks to 11ty templates, the muxPlaybackId is in the dom.
      // if it exists for this vod, we update the alpine data.
      if (this.$refs.muxPlaybackId.innerHTML !== '' && this.$refs.muxDeletionQueuedAt.innerHTML === '') {
        this.hasMux = true
        this.muxPlaybackId = this.$refs.muxPlaybackId.innerHTML
      }

      if (this.$refs.videoSrcHash.innerHTML !== '') {
        this.videoSrcHash = this.$refs.videoSrcHash.innerHTML
        this.hasIpfs = true
      }

      if (this.$refs.video240Hash.innerHTML !== '') {
        this.video240Hash = this.$refs.video240Hash.innerHTML
      }

      if (this.$refs.backend.innerHTML !== '') {
        this.backend = this.$refs.backend.innerHTML
      }

      if (this.$refs.videoDate.innerHTML !== '') {
        this.videoDate = this.$refs.videoDate.innerHTML
      }

      // if (this.isPublicPlayer()) {
      //   console.log(`public player!`)
      //   this.loadPublicPlayer()
      // }

      if (this.hasMux && Alpine.store('user').role === 'patron') {
        await this.getPlaybackTokens()
      }


      await defineCustomElements();
      this.vidstackPlayer = document.querySelector('media-player');
      this.vidstackPlayer.onAttach(() => {
        // console.log(`vidstackPlayer attached! videoSrcHash:${this.videoSrcHash}, video240Hash:${this.video240Hash}`)
        let sources = []
        if (!!this.videoSrcHash) sources.push({ 
          src: this.buildIpfsUrl(this.videoSrcHash),
          type: 'video/mp4' 
        });
        if (!!this.video240Hash) sources.push({ src: this.buildIpfsUrl(this.video240Hash), type: 'video/mp4' });
        if (!!this.playbackToken && !!this.muxPlaybackId) sources.push({ src: this.getMuxSrc(), type: 'video/mux' });
        // sources.push({ src: 'http://ipfs.io/ipfs/QmQWM1qDPasxm5sXAQeVMfmhnECBzyYkLgfK23yPif1Ftx', type: 'video/mp4' })
        // console.log(sources)
        this.vidstackPlayer.src = sources
      });

      this.vidstackPlayer.addEventListener('stalled', (event) => {
        this.createIssue('stall')
        if (this.hasMux && Alpine.store('user').role !== 'patron') {
          this.errors.push('We apologize for the inconvenience. The playback of this public video is currently stalled. This issue may be due to the current status of the IPFS network, file serving peers, or other factors. Did you know patrons have access to faster video streaming on select VODs like this one?')
        } else {
          this.errors.push('We apologize for the inconvenience. The playback of this public video is currently stalled. This issue may be due to the current status of the IPFS network, file serving peers, or other factors. Streaming may not be available at the moment. We appreciate your patience as we work to resolve this issue and restore seamless playback. Thank you for your understanding!')
        }
      });


      // Video

      // console.log(player.src)


      // player.src = { src: 'https://media-files.vidstack.io/720p.ogv', type: 'video/ogg' }

      // ,
      //   { src: 'https://media-files.vidstack.io/720p.mp4', type: 'video/mp4' },
      // ];




      // console.log(this.videoSrcHash)
      // console.log(sources)
      // console.log(player)


      // if (this.isPatronPlayer()) {
      //   console.log(`patron player!`)
      //   this.loadPatronPlayer()
      // }
      

    },
    async loadPublicPlayer() {
      this.publicPlayer = new Plyr('#public-player');
      this.publicPlayer.on('timeupdate', () => { 
        Alpine.store('player').seconds = this.publicPlayer.currentTime 
      })
    },
    async loadPatronPlayer() {

      // Patrons will have a strapi jwt in their localStorage.
      // We need to use this jwt to auth with the backend and GET /api/mux-asset/secure?playbackId=(...)
      // The playbackId is the Mux playback ID of the video the viewer wants to watch.
      // the backend signs a new JWT using it's MUX private key, and sends it to the frontend client.
      // the new JWT is appended to the video source url, which proves authorization to Mux.

      // steps:
      // get signed playback JWT
      try {
        console.log('getting signed playback JWT')
        await this.getPlaybackTokens()
        this.setVideoSrc()
      } catch (e) {
        this.errors.push(e)
      }
    },
    async getPlaybackTokens() {
      const res = await fetch(`${this.backend}/api/mux-asset/secure?id=${this.muxPlaybackId}`, {
        headers: {
          'Authorization': `Bearer ${Alpine.store('auth').jwt}`
        }
      })
      const json = await res.json()
      if (json?.playbackToken === undefined) throw new Error('Failed to get playback tokens. Please try again later.');
      else {
        this.playbackToken = json.playbackToken,
        this.storyboardToken = json.storyboardToken
      }
    },
    getMuxSrc() {
      return `https://stream.mux.com/${this.muxPlaybackId}.m3u8?token=${this.playbackToken}`
    },
    buildIpfsUrl(cid) {
      return `http://ipfs.io/ipfs/${cid}?filename=vod.mp4`
    },
    getVideoSrc() {
      // automatically get the best video source.
      // if the viewer is a patron, return the muxSrc.
      // if the viewer is public, return the ipfs sources
      if (Alpine.store('user').role === 'patron') return this.getMuxSrc();
      else {
        console.log(`videoSrcHash:${this.videoSrcHash}, video240Hash:${this.video240Hash}`)
        let sources = []
        let mp4Type = 'video/mp4'
        if (!!this.videoSrcHash) sources.push({ src: this.buildIpfsUrl(this.videoSrcHash), type: mp4Type });
        if (!!this.video240Hash) sources.push({ src: this.buildIpfsUrl(this.video240Hash), type: mp4Type });
        return sources
      }
    },
    setVideoSrc() {
      // const src = this.getMuxSrc()
      // console.log(`setting vidstack src to ${src}`)

      // // set vidstack src
      // const vidstackPlayer = document.querySelector('media-player');
      // vidstackPlayer.src = src;
      



      // set videojs src
      // set video src to `https://stream.mux.com/`
      // const player = videojs('patron-player', {
      //   plugins: {
      //     "httpSourceSelector": {},
      //     mux: {
      //       debug: false,
      //       data: {
      //         env_key: this.muxEnvKey,
      //         video_title: this.videoDate
      //       }
      //     }
      //   },
      // });
      // player.qualityLevels();

      // player.src([
      //   { 
      //     type: 'video/mux', 
      //     src: src,
      //     label: 'Patrons (CDN)',
      //   },
      //   { 
      //     type: 'video/mp4', 
      //     src: this.videoSrcHash,
      //     label: 'Public (IPFS) Source',
      //   },
      //   { 
      //     type: 'video/mp4', 
      //     src: this.video240Hash,
      //     label: 'Public (IPFS) 240p',
      //   },
      // ]);
      // player.timelineHoverPreviews({
      //   enabled: true, 
      //   src: `https://image.mux.com/${this.muxPlaybackId}/storyboard.vtt?token=${this.storyboardToken}`
      // });

      // add mux stream to #public-player (test)
      // this.publicPlayer.source = {
      //   type: 'video',
      //   title: 'testing 1234',
      //   sources: [
      //     {
      //       src: `https://stream.mux.com/${this.getMuxSrc()}`,
      //       type: 'video/mp4',
      //       title: 'wow nice',
      //       size: 1080
      //     },
      //     {
      //       src: this.videoSrcHash,
      //       type: 'video/mp4',
      //       title: 'just okay',
      //       size: 1080
      //     },
      //     {
      //       src: this.video240Hash,
      //       type: 'video/mp4',
      //       title: 'LEET',
      //       size: 240
      //     },
      //   ]
      // }

      // player.source = {
      //     type: 'video',
      //     title: 'Example title',
      //     sources: [
      //       {
      //         src: 
      //       },
      //         {
      //             src: '/path/to/movie.mp4',
      //             type: 'video/mp4',
      //             size: 720,
      //         } 
      //     ],
      //     poster: '/path/to/poster.jpg'
      // };

    },
  }
}
