import videojs from '@mux/videojs-kit/dist/index.vhs.js';


export default function () {
  return {
    hasMux: false,
    muxPlaybackId: '',
    preference: this.$persist('public'),
    errors: [],
    playbackJwt: '',
    backendUrl: '',
    async init() {
      // Thanks to 11ty templates, the muxPlaybackId is in the dom.
      // if it exists for this vod, we update the alpine data.
      if (this.$refs.muxPlaybackId.innerHTML !== '') {
        this.hasMux = true
        this.muxPlaybackId = this.$refs.muxPlaybackId.innerHTML
      }

      if (this.$refs.backendUrl.innerHTML !== '') {
        this.backendUrl = this.$refs.backendUrl.innerHTML
      }

      // Patrons will have a strapi jwt in their localStorage.
      // We need to use this jwt to auth with the backend and GET /api/mux/secure?playbackId=(...)
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
      const res = await fetch(`${this.backendUrl}/api/mux/secure?id=${this.muxPlaybackId}`, {
        headers: {
          'Authorization': `Bearer ${Alpine.store('env').jwt}`
        }
      })
      const json = await res.json()
      if (json?.token === undefined) throw new Error('Failed to get token. Please try again later.');
      else {
        console.log(`getPlaybackToken result looks good. here is the jwt:${json.token}`)
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
