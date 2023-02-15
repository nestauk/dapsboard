import {writable} from 'svelte/store';

export const _credentials = writable();

export const _isAuthenticated = writable(false);

export const _isAuthModalOpen = writable(false);
