export default function auth () {
  return {
    open: false,
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
      const res = await fetch(`${this.$refs.backend.innerHTML}/api/auth/patreon/callback?access_token=${this.accessToken}`)
      const json = await res.json()
      if (json?.jwt === undefined) throw new Error('Failed to get auth token. Please try again later.');
      else {
        console.log(JSON.stringify(json))
        if (json?.jwt) Alpine.store('auth').jwt = json.jwt;
        if (json?.user?.username) Alpine.store('auth').username = json.user.username;
        if (json?.user?.id) Alpine.store('auth').userId = json.user.id;
        if (json?.role?.type) Alpine.store('user').role = json.role.type;
      }
    },
    redirect() {
      // this is for redirecting 
      // from /connect/patreon/redirect
      // to whatever page the user was previously at
      window.location.pathname = Alpine.store('auth').lastVisitedPath
      this.done = true
    }
  }
}