import videojs from '@mux/videojs-kit/dist/index.vhs.js';


export default function player () {
  return {
    hasMux: false,
    muxPlaybackId: '',
    preference: this.$persist('public'),
    errors: [],
    playbackJwt: '',
    backend: '',
    isPlayerSelector () {
      return (
        this.hasMux &&
        Alpine.store('auth').jwt !== ''
      )
    },
    isPatronPlayer () {
      return (
        Alpine.store('auth').jwt !== '' &&
        this.hasMux && 
        this.preference === 'patron'
      )
    },
    isPublicPlayer () {
      return (
        !this.hasMux ||
        Alpine.store('auth').jwt === '' ||
        this.preference === 'public'
      )
    },
    init () {
      // Thanks to 11ty templates, the muxPlaybackId is in the dom.
      // if it exists for this vod, we update the alpine data.
      if (this.$refs.muxPlaybackId.innerHTML !== '') {
        this.hasMux = true
        this.muxPlaybackId = this.$refs.muxPlaybackId.innerHTML
      }

      if (this.$refs.backend.innerHTML !== '') {
        this.backend = this.$refs.backend.innerHTML
      }

      if (this.isPatronPlayer()) {
        this.loadPatronPlayer()
      }
    },
    async loadPatronPlayer() {

      console.log('>> loading patron player')
      // Patrons will have a strapi jwt in their localStorage.
      // We need to use this jwt to auth with the backend and GET /api/mux-asset/secure?playbackId=(...)
      // The playbackId is the Mux playback ID of the video the viewer wants to watch.
      // the backend signs a new JWT using it's MUX private key, and sends it to the frontend client.
      // the new JWT is appended to the video source url, which proves authorization to Mux.

      // steps:
      // get signed playback JWT
      try {
        await this.getPlaybackToken()
        this.setVideoSrc()
      } catch (e) {
        this.errors.push(e)
      }
    },
    async getPlaybackToken() {
      const res = await fetch(`${this.backend}/api/mux-asset/secure?id=${this.muxPlaybackId}`, {
        headers: {
          'Authorization': `Bearer ${Alpine.store('auth').jwt}`
        }
      })
      const json = await res.json()
      if (json?.token === undefined) throw new Error('Failed to get playback token. Please try again later.');
      else {
        this.playbackJwt = json.token
      }
    },
    setVideoSrc() {
      // set video src to `https://stream.mux.com/`
      const player = videojs('patron-player', {
        "timelineHoverPreviews": true
      });
      player.src({ type: 'video/mux', src: `${this.muxPlaybackId}?token=${this.playbackJwt}` });
    },
  }
}
