import {writable} from 'svelte/store';

export const _isAuthModalOpen = writable(false);

export const _credentials = writable();
