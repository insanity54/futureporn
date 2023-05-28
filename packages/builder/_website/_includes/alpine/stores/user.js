
export default function registerUserStore(alpine) {
  alpine.store('user', {
    role: alpine.$persist('public'),
    image: alpine.$persist('https://placehold.co/32x32')
  })
}