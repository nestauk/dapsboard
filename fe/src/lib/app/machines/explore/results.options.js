import * as _ from 'lamb';
import {get} from 'svelte/store';
import {assign, send} from 'xstate';

import {request} from '$lib/utils/net';
import {makeExplorePath} from '$lib/app/utils/exploreUtils';

const isMatching = ctx => {
	const {project, source, version} = get(ctx.dataset);
	const fields = get(ctx.selectedFields);
	const targetPath = makeExplorePath({fields, project, source, version});
	return targetPath === get(ctx.currentURL);
}

const isInCache = ctx => {
	const cacheKey = get(ctx.cacheKey);
	return cacheKey in get(ctx.cachedResults);
}

const setCacheKey = ctx => {
	const {project, source, version} = get(ctx.dataset);
	const fields = get(ctx.selectedFields);
	ctx.cacheKey.set(makeExplorePath({fields, project, source, version}));
	return ctx;
}

const loadFromCache = ctx => {
	const cacheKey = get(ctx.cacheKey);
	const cache = get(ctx.cachedResults);
	ctx.currentResult.set(cache[cacheKey]);
	return ctx;
}

const updateCache = (ctx, event) => {
	const cacheKey = get(ctx.cacheKey);
	ctx.cachedResults.update(_.setKey(cacheKey, event.data));
	return ctx;
};

const updateCurrentResults = (ctx, event) => {
	ctx.currentResult.set(event.data);
	return ctx;
};

const doQuery = ctx => {
	ctx.currentResult.set(null);
	return request('POST', get(ctx.queryURL), {data: get(ctx.query)});
}

const getError = (ctx, event) => {
	ctx.currentResult.set(event.data.jsonMessage);
	return ctx;
}

export const resultsOptions = {
	actions: {
		getError: assign(getError),
		loadFromCache: assign(loadFromCache),
		sendResultsUpdated: send('RESULTS_UPDATED'),
		setCacheKey: assign(setCacheKey),
		updateCache: assign(updateCache),
		updateCurrentResults: assign(updateCurrentResults),
	},
	guards: {
		isInCache,
		isMatching,
	},
	services: {
		apiRequest: ctx => doQuery(ctx),
	}
};
