
export default function registerEnvStore(alpine) {
  alpine.store('env', {
    backend: window.backend, // can't access $refs at this point
    loginUrl: `${window.backend}/api/connect/patreon`,
    companionUrl: window.companionUrl
  })
}