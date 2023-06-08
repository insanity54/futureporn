
export default function registerUserStore(alpine) {
  alpine.store('user', {
    id: alpine.$persist(0),
    role: alpine.$persist('public'),
    image: alpine.$persist('https://placehold.co/32x32')
  })
}