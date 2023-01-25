import * as _ from 'lamb';
import {get} from 'svelte/store';
import {assign, send} from 'xstate';
import {applyFnMap} from '@svizzle/utils';

import {
	selectedDataset,
	selectedDatasetSchema
} from '$lib/app/stores/exploreStores';
import {
	keywordFieldTypes,
	makeGetFieldsOfTypes
} from '$lib/elasticsearch/types/fields.utils';
import {
	getCountQuery,
	getSuggestionsQuery
} from '$lib/elasticsearch/aggs/utils/query';
import {makeGetSuggestionsBy} from '$lib/elasticsearch/aggs/utils/suggestions';
import {request} from '$lib/utils/net';
import {getSearchURL} from '$lib/utils/specs';

import {createBaseSearchStores} from './search.context';

/* Fields utils */

const getKeywordFields = makeGetFieldsOfTypes(keywordFieldTypes);

function getFieldSelection (fieldStats, userSelection) {
	const exists = fieldStats.some(item => item.name === userSelection);
	if (userSelection && exists) {
		return userSelection;
	}
	if (fieldStats.length > 0) {
		return fieldStats[0].name;
	}
	return null;
}

const getCountInfo = applyFnMap({
	name: _.getAt(0),
	count: _.getPath('1.doc_count')
});

const getCount = _.getKey('count');
const mapResponseToFieldCount = _.pipe([
	_.getPath('aggregations.messages.buckets'),
	_.pairs,
	_.mapWith(getCountInfo),
	_.filterWith(_.pipe([getCount, _.isGT(0)])),
	_.sortWith([_.sorterDesc(getCount)]),
]);

/* Fields services */

const fieldsStatsRequest = ({searchQuery}) => {
	const data = getCountQuery(
		getKeywordFields(get(selectedDatasetSchema)),
		get(searchQuery)
	);
	const url = getSearchURL(get(selectedDataset));
	return request('POST', url, {data});
};

/* Fields options */

const isInStatsCache = ctx =>
	get(ctx.statsCacheKey) in get(ctx.statsCache);

function selectNextSearchField (ctx) {
	const selectedFieldName = get(ctx.selectedFieldName);
	const nextFieldNames = get(ctx.nextFieldNames);
	const fieldStats = get(ctx.fieldStats);
	const userSelection = get(ctx.userSelection);

	const nextFieldId = nextFieldNames[selectedFieldName];
	if (nextFieldId) {
		ctx.userSelection.set(nextFieldId);
		ctx.selectedFieldName.set(getFieldSelection(
			fieldStats,
			userSelection
		));
	}
	return ctx;
}

function selectPrevSearchField (ctx) {
	const selectedFieldName = get(ctx.selectedFieldName);
	const prevFieldNames = get(ctx.prevFieldNames);
	const fieldStats = get(ctx.fieldStats);
	const userSelection = get(ctx.userSelection);

	const prevFieldId = prevFieldNames[selectedFieldName];
	if (prevFieldId) {
		ctx.userSelection.set(prevFieldId);
		ctx.selectedFieldName.set(getFieldSelection(
			fieldStats,
			userSelection
		));
	}
	return ctx;
}

const setMenuActive = ctx => {
	ctx.isFieldsMenuActive.set(true);
	return ctx;
}

const setMenuInactive = ctx => {
	ctx.isFieldsMenuActive.set(false);
	return ctx;
}

const setStatsCacheKey = ctx => {
	const {project, source, version} = get(ctx.dataset);
	const searchQuery = get(ctx.searchQuery);

	ctx.statsCacheKey.set(`${project}-${source}-${version}-${searchQuery}`);
	return ctx;
};

function updateCurrentField (ctx, {detail}) {
	const fieldStats = get(ctx.fieldStats);
	const userSelection = get(ctx.userSelection);

	ctx.userSelection.set(detail);
	ctx.selectedFieldName.set(getFieldSelection(
		fieldStats,
		userSelection
	));
	return ctx;
}

const updateFieldStats = (ctx, {data}) => {
	let userSelection = get(ctx.userSelection);

	const fieldStats = mapResponseToFieldCount(data);
	if (fieldStats.length === 0) {
		userSelection = null;
	}
	const fieldNames = _.pluckFrom(fieldStats, 'name');
	const nextFieldNames = fieldNames.slice(1);
	const prevFieldNames = fieldNames.slice(0,-1);
	ctx.fieldStats.set(fieldStats);
	ctx.userSelection.set(userSelection);
	ctx.nextFieldNames.set(_.make(prevFieldNames, nextFieldNames));
	ctx.prevFieldNames.set(_.make(nextFieldNames, prevFieldNames));
	ctx.selectedFieldName.set(getFieldSelection(
		fieldStats,
		userSelection
	));
	return ctx;
};

const loadFieldStatsFromCache = ctx => updateFieldStats(
	ctx,
	{data: get(ctx.statsCache)[get(ctx.statsCacheKey)]}
);

const updateSearchQuery = (ctx, {detail}) => {
	ctx.searchQuery.set(detail.trim().toLowerCase());
	return ctx;
}

const updateStatsCache = (ctx, {data}) => {
	const statsCacheKey = get(ctx.statsCacheKey);

	ctx.statsCache.update(_.setKey(statsCacheKey, data));
	return ctx;
};

/* Suggestions services */

const suggestionsRequest = ctx => request(
	'POST',
	getSearchURL(get(selectedDataset)),
	{
		data: getSuggestionsQuery(
			get(ctx.selectedFieldName),
			get(ctx.searchQuery)
		)
	}
);

/* Suggestions options */

const isInSuggestionsCache = ctx =>
	get(ctx.suggestionsCacheKey) in get(ctx.suggestionsCache);

const isSuggestionsRequestIncomplete = ctx =>
	!(Boolean(get(ctx.searchQuery)) && Boolean(get(ctx.selectedFieldName)));

const setAsWaiting = ctx => {
	ctx.suggestions.set(["Waiting..."]);
	return ctx;
}

const setSuggestionsCacheKey = ctx => {
	const {project, source, version} = get(ctx.dataset);
	const searchQuery = get(ctx.searchQuery);
	const selectedFieldName = get(ctx.selectedFieldName);

	ctx.suggestionsCacheKey.set(
		`${project}-${source}-${version}-${searchQuery}-${selectedFieldName}`
	);
	return ctx;
};

const updateSuggestionsCache = (ctx, {data}) => {
	const suggestionsCacheKey = get(ctx.suggestionsCacheKey);

	ctx.suggestionsCache.update(_.setKey(suggestionsCacheKey, data));
	return ctx;
};

const updateSuggestions = (ctx, {data}) => {
	const selectedFieldName = get(ctx.selectedFieldName);
	const searchQuery = get(ctx.searchQuery);

	const aggs = data.aggregations[selectedFieldName];
	const buckets = aggs && aggs.buckets || [];
	const makeSuggestions = makeGetSuggestionsBy(searchQuery);
	const suggestions = makeSuggestions(buckets);
	ctx.suggestions.set(suggestions);

	return ctx;
}

const loadSuggestionsFromCache = ctx => updateSuggestions(
	ctx,
	{data: get(ctx.suggestionsCache)[get(ctx.suggestionsCacheKey)]}
);

export const searchOptions = {
	actions: {
		loadStatsFromCache: assign(loadFieldStatsFromCache),
		loadSuggestionsFromCache: assign(loadSuggestionsFromCache),
		resetSearchContext: assign(createBaseSearchStores),
		selectNextSearchField: assign(selectNextSearchField),
		selectPrevSearchField: assign(selectPrevSearchField),
		sendFieldUpdated: send('FIELD_UPDATED'),
		// sendQueryUpdated: send('QUERY_UPDATED'), // Leaving tie-in for last
		sendSearchQueryUpdated: send('SEARCH_QUERY_UPDATED'),
		setAsWaiting: assign(setAsWaiting),
		setMenuActive: assign(setMenuActive),
		setMenuInactive: assign(setMenuInactive),
		setStatsCacheKey: assign(setStatsCacheKey),
		setSuggestionsCacheKey: assign(setSuggestionsCacheKey),
		updateCurrentField: assign(updateCurrentField),
		updateFieldStats: assign(updateFieldStats),
		// updateQuery: assign(updateQuery),
		updateSearchQuery: assign(updateSearchQuery),
		updateStatsCache: assign(updateStatsCache),
		updateSuggestions: assign(updateSuggestions),
		updateSuggestionsCache: assign(updateSuggestionsCache)
	},
	guards: {
		isInStatsCache,
		isInSuggestionsCache,
		isSuggestionsRequestIncomplete
	},
	services: {
		fieldsStatsRequest,
		suggestionsRequest
	}
};
