export default function () {
  return {
    open: false,
    avatar: this.$persist('http://placekitten.com/32/32'),
    lastVisitedPath: this.$persist('/'),
    accessToken: '',
    error: '',
    done: false,
    async init() {
      try {
        this.getAccessToken()
        await this.getJwt()
        this.redirect()
      } catch (e) {
        this.error = e
      }
    },
    getAccessToken() {
      // greets https://stackoverflow.com/a/901144/1004931
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
      });

      if (params?.access_token === undefined || params?.access_token === null) {
        throw new Error('Failed to get access_token from auth portal.');
      }
      else {
        this.accessToken = params.access_token
      }
    },
    async getJwt() {
      const res = await fetch(`${this.$refs.backendUrl.innerHTML}/api/auth/patreon/callback?access_token=${this.accessToken}`)
      const json = await res.json()
      if (json?.jwt === undefined) throw new Error('Failed to get auth token. Please try again later.');
      else {
        Alpine.store('env').jwt = json.jwt
      }
    },
    redirect() {
      // this is for redirecting 
      // from /connect/patreon/redirect
      // to whatever page the user was previously at
      window.location.pathname = this.lastVisitedPath
      this.done = true
    }
  }
}