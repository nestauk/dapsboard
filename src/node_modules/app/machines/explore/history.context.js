import {writable} from 'svelte/store';

export const createHistoryStores = () => ({
	currentURL: writable(),
});
