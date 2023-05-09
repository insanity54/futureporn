// greets https://github.com/horikeso/alpinejs-website-with-authentication-example/blob/main/src/stores/auth.js

export default function registerAuthStore(alpine) {
  alpine.store('auth', {
    jwt: alpine.$persist(''),
    username: alpine.$persist(''),
    userId: alpine.$persist(''),
    logout () {
      alpine.store('auth').jwt = '';
      alpine.store('auth').username = '';
      alpine.store('auth').userId = '';
    }
  })
}