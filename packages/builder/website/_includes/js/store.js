import { writable } from 'svelte/store';

export const gatewayStore = writable({ name: 'ipfs.io', pattern: 'https://ipfs.io/ipfs/:hash' });
