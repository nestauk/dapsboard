import {writable} from 'svelte/store';

export const createResultsStores = () => ({
	aggsParams: writable({}),
	cachedResults: writable({}),
	cacheKey: writable(),
	currentResult: writable(),
	nextAggs: writable({}),
	query: writable({}),
	queueResults: writable({}),
});
