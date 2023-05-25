// greets https://github.com/horikeso/alpinejs-website-with-authentication-example/blob/main/src/stores/auth.js

export default function registerAuthStore(alpine) {
  alpine.store('auth', {
    jwt: alpine.$persist(''),
    username: alpine.$persist(''),
    userId: alpine.$persist(''),
    lastVisitedPath: alpine.$persist('/profile'),
    logout () {
      alpine.store('auth').jwt = '';
      alpine.store('auth').username = '';
      alpine.store('auth').userId = '';
    },
    login () {
      alpine.store('auth').lastVisitedPath = window.location.pathname
      const connectUrl = `${window.backend}/api/connect/patreon`
      console.log(`we are logging in to ${connectUrl} and the lastVisitedPath is ${alpine.store('auth').lastVisitedPath}`)
      window.location.assign(connectUrl)
    }
  })
}