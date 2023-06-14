

export default function registerPlayerStore(alpine) {
  alpine.store('player', {
    seconds: 0,
    formatTime(seconds) {
      return new Date(seconds * 1000).toISOString().slice(11, 19);
    }
  })
}