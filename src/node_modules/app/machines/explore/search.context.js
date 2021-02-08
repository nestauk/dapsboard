import {writable} from 'svelte/store';

export const createBaseSearchStores = () => ({
	fieldStats: writable([]),
	isFieldsMenuActive: writable(false),
	suggestions: writable([]),
	searchQuery: writable(''),
	selectedFieldName: writable(),
	nextFieldNames: writable([]),
	prevFieldNames: writable([]),
	userSelection: writable(),
});

export const createSearchStores = () => ({
	...createBaseSearchStores(),
	statsCache: writable({}),
	statsCacheKey: writable(),
	suggestionsCache: writable({}),
	suggestionsCacheKey: writable(),
});
