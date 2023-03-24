// store.js


import { writable } from 'svelte/store'

const isClient = (typeof process === 'undefined')
const publicGateway = 'https://ipfs.io'
const stored = (isClient) ? localStorage.defaultGateway : publicGateway
export const defaultGateway = writable(stored || publicGateway)

// Anytime the store changes, update the local storage value.
if (isClient) {
  defaultGateway.subscribe((value) => localStorage.defaultGateway = value)
}

