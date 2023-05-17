
export default function registerUserStore(alpine) {
  alpine.store('user', {
    role: alpine.$persist('public'),
  })
}