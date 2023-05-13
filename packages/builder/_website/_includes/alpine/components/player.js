import videojs from '@mux/videojs-kit/dist/index.vhs.js';


export default function player () {
  return {
    hasMux: false,
    hasIpfs: false,
    muxPlaybackId: '',
    preference: this.$persist('public'),
    errors: [],
    playbackToken: '',
    thumbnailToken: '',
    backend: '',
    muxEnvKey: 'bmvsfoe2j5d6655ad9g6u82ls',
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
      return this.hasIpfs && (
        !this.hasMux ||
        Alpine.store('auth').jwt === '' ||
        this.preference === 'public'
      )
    },
    init () {
      // Thanks to 11ty templates, the muxPlaybackId is in the dom.
      // if it exists for this vod, we update the alpine data.
      if (this.$refs.muxPlaybackId.innerHTML !== '' && this.$refs.muxDeletionQueuedAt.innerHTML === '') {
        this.hasMux = true
        this.muxPlaybackId = this.$refs.muxPlaybackId.innerHTML
      }

      if (this.$refs.videoSrcHash.innerHTML !== '') {
        this.hasIpfs = true
      }

      if (this.$refs.backend.innerHTML !== '') {
        this.backend = this.$refs.backend.innerHTML
      }

      if (this.isPatronPlayer()) {
        this.loadPatronPlayer()
      }
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
    setVideoSrc() {
      // set video src to `https://stream.mux.com/`
      const player = videojs('patron-player', {
        plugins: {
          mux: {
            debug: false,
            data: {
              env_key: this.muxEnvKey,
              video_title: 'Example Title'
            }
          }
        }
      });
      player.src({ type: 'video/mux', src: `${this.muxPlaybackId}?token=${this.playbackToken}` });
      player.timelineHoverPreviews({
        enabled: true, 
        src: `https://image.mux.com/${this.muxPlaybackId}/storyboard.vtt?token=${this.storyboardToken}`
      });
    },
  }
}
