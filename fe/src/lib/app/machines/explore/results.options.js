import {
	applyFnMap,
	isObjNotEmpty,
	pickIfTruthy,
	renameKeysWith,
	splitByDot,
} from '@svizzle/utils';
import * as _ from 'lamb';
import {get} from 'svelte/store';
import {assign, send} from 'xstate';

import {
	isValidAgg,
	makeExplorePath,
	useDefaults
} from '$lib/app/utils/exploreUtils.js';
import {integerD} from '$lib/types/index.js';
import {request} from '$lib/utils/net.js';
import {getDatasetIdOf} from '$lib/utils/specs.js';
import {arrayToObjectWith}
	from '$lib/utils/svizzle/utils/[any-array]-[array-object].js';

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

const updateCache = ctx => {
	const cacheKey = get(ctx.cacheKey);
	const queueResults = get(ctx.queueResults);
	ctx.cachedResults.update(_.setKey(cacheKey, queueResults));
	return ctx;
};

const mergeQueueResults = (ctx, event) => {
	const queueResults = get(ctx.queueResults);
	ctx.queueResults.set({
		...queueResults,
		...event.data.aggregations
	});
	return ctx;
};

const updateCurrentResults = ctx => {
	const queueResults = get(ctx.queueResults);
	ctx.currentResult.set(queueResults);
	return ctx;
};

/* queue */

const resetQueue = ctx => {
	ctx.aggsParams.set({});
	ctx.query.set({});
	ctx.queueResults.set({});
	return ctx;
};

const initQueue = ctx => {
	const selectionAggs = get(ctx.selectionAggs);
	ctx.nextAggs.set(selectionAggs);
	resetQueue(ctx);
	return ctx;
}

// util
const getResultsKeyedByAggId = renameKeysWith(_.pipe([splitByDot, _.getAt(2)]));

// util: create params from results
const resultsToParams = applyFnMap({
	histogram: _.pipe([
		applyFnMap({
			interval: queueResults => {
				if (!queueResults) {
					return
				}

				const resultsKeyedByAggId = getResultsKeyedByAggId(queueResults);
				if (!resultsKeyedByAggId.stats) {
					return
				}

				const {stats: {count, min, max}} = resultsKeyedByAggId;
				const binCount = Math.sqrt(count);
				const interval = Math.max(
					Math.round((max - min) / binCount, 10),
					1
				);

				// eslint-disable-next-line consistent-return
				return integerD(interval);
			}
		}),
		pickIfTruthy
	])
});

const updateAggsParams = ctx => {
	const queueResults = get(ctx.queueResults);
	const aggsParams = resultsToParams(queueResults);
	ctx.aggsParams.set(aggsParams);
	return ctx;
};

// util: merge each agg.request with available params
const enhanceAggs = (aggs, params) => _.map(aggs,
	agg => _.setIn(agg, 'request', {
		...agg.request,
		...params[agg.id],
	})
);

const updateQueue = ctx => {
	const {project, source, version} = get(ctx.dataset);
	const remaininAggs = get(ctx.nextAggs);
	const aggsParams = get(ctx.aggsParams);
	const augmentedRemainingAggs = enhanceAggs(remaininAggs, aggsParams);

	const [validAggs, nextAggs] = _.partition(augmentedRemainingAggs, isValidAgg);

	const datasetId = getDatasetIdOf({project, source, version});
	const aggsToObject = arrayToObjectWith(agg => {
		const requestWithDefaults = useDefaults(agg.request);
		const replacedFieldName = (agg.request.field || 'noField').replace('.', '_');
		return [
			`${datasetId}.${replacedFieldName}.${agg.id}.${agg.response.id}`,
			{[agg.id]: requestWithDefaults}
		]
	});

	const query = {
		aggs: aggsToObject(validAggs),
		size: 0
	};

	ctx.query.set(query);
	ctx.nextAggs.set(nextAggs);

	return ctx;
}

const hasQuery = ctx => isObjNotEmpty(get(ctx.query).aggs);

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
		initQueue: assign(initQueue),
		loadFromCache: assign(loadFromCache),
		mergeQueueResults: assign(mergeQueueResults),
		resetQueue: assign(resetQueue),
		sendResultsUpdated: send('RESULTS_UPDATED'),
		setCacheKey: assign(setCacheKey),
		updateAggsParams: assign(updateAggsParams),
		updateCache: assign(updateCache),
		updateCurrentResults: assign(updateCurrentResults),
		updateQueue: assign(updateQueue),
	},
	guards: {
		hasQuery,
		isInCache,
		isMatching,
	},
	services: {
		apiRequest: ctx => doQuery(ctx),
	}
};
