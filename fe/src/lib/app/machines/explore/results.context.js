import {writable} from 'svelte/store';

export const createResultsStores = () => ({
	cachedResults: writable({}),
	cacheKey: writable(),
	currentResult: writable(),
	nextAggsHierarchy: writable({}),
	queriedHierarchy: writable({}),
	queuedAggs: writable({}),
	queueResults: writable([]),
});
