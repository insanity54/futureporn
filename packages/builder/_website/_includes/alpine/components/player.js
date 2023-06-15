
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
    async loadVidstack () {
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
        this.vidstackPlayer.src = sources
      });

      this.vidstackPlayer.addEventListener('stalled', (event) => {
        // this.createIssue('stall')
        const messageStart = 'We apologize for the inconvenience. The playback of this public video is currently stalled. This issue may be due to the current status of the IPFS network, file serving peers, or other factors.'
        if (this.hasMux && Alpine.store('user').role !== 'patron') {
          this.errors.push(messageStart+' May I interest you in becoming a patron? Patrons have access to faster video streaming on select VODs like this one.')
        } else {
          this.errors.push(messageStart+' Streaming may not be available at the moment.')
        }
      });

      this.vidstackPlayer.addEventListener('time-update', (event) => {
        Alpine.store('player').seconds = event.detail.currentTime
      })

      this.$refs.vidstackPlayer = this.vidstackPlayer
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


      if (this.hasMux && Alpine.store('user').role === 'patron') {
        await this.getPlaybackTokens()
      }

      this.loadVidstack()


    },
    // async loadPatronPlayer() {

    //   // Patrons will have a strapi jwt in their localStorage.
    //   // We need to use this jwt to auth with the backend and GET /api/mux-asset/secure?playbackId=(...)
    //   // The playbackId is the Mux playback ID of the video the viewer wants to watch.
    //   // the backend signs a new JWT using it's MUX private key, and sends it to the frontend client.
    //   // the new JWT is appended to the video source url, which proves authorization to Mux.

    //   // steps:
    //   // get signed playback JWT
    //   try {
    //     await this.getPlaybackTokens()
    //     this.setVideoSrc()
    //   } catch (e) {
    //     this.errors.push(e)
    //   }
    // },
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
  }
}
