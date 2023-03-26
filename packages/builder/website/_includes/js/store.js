// store.js


import { persisted } from 'svelte-local-storage-store'


const isClient = (typeof process === 'undefined')
const publicGateway = { hostname: 'ipfs.io', pattern: 'https://ipfs.io/ipfs/:hash' }
const stored = (isClient) ? localStorage.defaultGateway : publicGateway
export const defaultGateway = persisted('defaultGateway', publicGateway)
