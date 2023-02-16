import {applyFnMap, isObjNotEmpty, mergeObj} from '@svizzle/utils';
import * as _ from 'lamb';
import {get} from 'svelte/store';
import {assign, send} from 'xstate';

import {
	isValidAgg,
	makeExplorePath,
	padZeroesLeft,
	useDefaults,
} from '$lib/app/utils/exploreUtils.js';
import {authedRequest} from '$lib/app/utils/net.js';
import {integerD} from '$lib/types/index.js';

const isMatching = ctx => {
	const {project, source, version} = get(ctx.dataset);
	const fields = get(ctx.selectedFields);
	const neededFields = get(ctx._neededFields);
	const targetPath = makeExplorePath({fields, neededFields, project, source, version});
	return targetPath === get(ctx.currentURL);
}

const isInCache = ctx => {
	const cacheKey = get(ctx.cacheKey);
	return cacheKey in get(ctx.cachedResults);
}

const setCacheKey = ctx => {
	const {project, source, version} = get(ctx.dataset);
	const fields = get(ctx.selectedFields);
	const neededFields = get(ctx._neededFields);
	ctx.cacheKey.set(makeExplorePath({fields, neededFields, project, source, version}));
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

const updateCurrentResults = ctx => {
	const queueResults = get(ctx.queueResults);
	ctx.currentResult.set(queueResults);
	return ctx;
};

/* queue */

const resetQueue = ctx => {
	ctx.queriedHierarchy.set({});
	ctx.nextAggsHierarchy.set({});
	ctx.queuedAggs.set({});
	ctx.queueResults.set([]);
	return ctx;
};

const initQueue = ctx => {
	resetQueue(ctx);
	const selectionAggsHierarchy = get(ctx.selectionAggsHierarchy);
	ctx.nextAggsHierarchy.set(selectionAggsHierarchy);
	return ctx;
}

// util

const aggParamsSources = {
	histogram: {
		aggId: 'extended_stats',
		getter: applyFnMap({
			interval: aggResult => {
				const {count, min, max} = aggResult;
				const binCount = Math.min(Math.sqrt(count), 10);
				const interval = Math.max(Math.round((max - min) / binCount), 1);

				// eslint-disable-next-line consistent-return
				return integerD(interval);
			}
		})
	}
};

const getAggParams = (node, queueResults) => {
	let params = {};

	/* e.g.
	node.agg.id = 'histogram'
	source.aggId = 'stats'
	*/
	const source = aggParamsSources[node.agg.id];
	if (source) {
		const item = _.find(queueResults, ({path: [meta]}) =>
			meta.aggId === source.aggId
			&& meta.fieldName === node.fieldName
		);
		if (item) {
			params = source.getter(item.result);
		}
	}

	return params;
}

const augmentHierarchy = (hierarchy, queueResults) => {
	const keys = _.sort(_.keys(hierarchy));
	const newHierarchy = _.reduce(keys, (acc, key) => {
		const node = hierarchy[key];
		const params = getAggParams(node, queueResults);

		acc[key] = _.setPathIn(node, 'agg.request', {
			...node.agg.request,
			...params,
		});

		return acc;

	}, {});

	return newHierarchy;
}

const partitionHierarchy = (hierarchy, queriedHierarchy) => {
	const map = {};
	const remap = _.flatMapWith(x => map[x] ?? x);
	const remapChildren = _.mapValuesWith(node => {
		let newNode = {...node};
		if (newNode.children) {
			newNode.children = remap(newNode.children);
		}
		return newNode;
	});

	const initialKeys = _.sort(_.keys(hierarchy));
	let newIdx = initialKeys.length;
	let invalidHierarchy = {};
	let validHierarchy = {};
	_.forEach(
		initialKeys,
		idx => {
			const node = hierarchy[idx];
			const {agg, children} = node;
			const isValid = isValidAgg(agg);

			if (!children) {
				if (isValid) {
					validHierarchy[idx] = {...node};
				} else {
					invalidHierarchy[idx] = {...node};
				}
			} else if (!isValid) {
				invalidHierarchy[idx] = {...node};
			} else {
				//  parent node is valid

				const updatedChildren = remap(children);
				const [validChildren, invalidChildren] = _.partition(
					updatedChildren,
					childIdx => _.has(queriedHierarchy, childIdx) || _.has(validHierarchy, childIdx)
				);

				if (validChildren.length === updatedChildren.length) {
					// all valid children: the local tree is valid
					validHierarchy[idx] = {
						...node,
						children: updatedChildren
					};
				} else if (invalidChildren.length === updatedChildren.length) {
					// all invalid children: the local tree is invalid
					invalidHierarchy[idx] = {
						...node,
						children: updatedChildren
					};
				} else {
					// valid + invalid children: split into 2 local trees
					let key;

					// valid local tree
					newIdx += 1;
					key = `${idx}.${padZeroesLeft(newIdx)}`;
					validHierarchy[key] = {
						...node,
						idx: key,
						children: validChildren
					};
					map[idx] = [key];

					// invalid local tree
					newIdx += 1;
					key = `${idx}.${padZeroesLeft(++newIdx)}`;
					invalidHierarchy[key] = {
						...node,
						idx: key,
						children: invalidChildren
					};
					map[idx].push(key);
				}
			}

			validHierarchy = remapChildren(validHierarchy);
			invalidHierarchy = remapChildren(invalidHierarchy);
			// TBD, we might need to remap hierarchies keys too
		}
	);

	return [validHierarchy, invalidHierarchy];
}

const hierarchyToAggs = (hierarchy, queriedHierarchy) => {
	const aggs = {};
	const joinedHierarchy = {
		...hierarchy,
		...queriedHierarchy,
	};
	_.forEach(_.values(hierarchy), node => {
		const {agg, datasetId, children, depth, fieldName, id} = node;

		const requestWithDefaults = useDefaults(agg.request);
		const aggObject = {
			[agg.id]: requestWithDefaults,
			meta: {
				aggId: agg.id,
				datasetId,
				depth,
				fieldName,
				id,
				request: requestWithDefaults,
				responseId: agg.response.id,
			}
		}

		if (children) {
			aggObject.meta.children = _.map(
				children,
				nodeId => hierarchy[nodeId]?.id || queriedHierarchy[nodeId]?.id
			);

			const childrenHierarchy = _.pickIn(joinedHierarchy, children);
			const childAggs = hierarchyToAggs(childrenHierarchy, {});
			aggObject.aggs = childAggs;
		}

		aggs[id] = aggObject;
	});

	return aggs;
};

const updateQueue = ctx => {
	const hierarchy = get(ctx.nextAggsHierarchy);
	const queriedHierarchy = get(ctx.queriedHierarchy);
	const queueResults = get(ctx.queueResults);

	const augmentedHierarchy = augmentHierarchy(hierarchy, queueResults);
	const [validHierarchy, invalidHierarchy] = partitionHierarchy(augmentedHierarchy, queriedHierarchy);
	const aggs = hierarchyToAggs(validHierarchy, queriedHierarchy);

	ctx.queriedHierarchy.update(mergeObj(validHierarchy));
	ctx.queuedAggs.set(aggs);
	ctx.nextAggsHierarchy.set(invalidHierarchy);

	return ctx;
}

const hasQueuedAggs = ctx => isObjNotEmpty(get(ctx.queuedAggs));

const neededFieldsToQuery = neededFields => ({
	bool: {
		must: _.map(neededFields, field => ({exists: {field}}))

	}
});

const requestQueuedAggs = ctx => {
	ctx.currentResult.set();
	const aggs = get(ctx.queuedAggs);

	const neededFields = get(ctx._neededFields);
	const query = neededFieldsToQuery(neededFields);
	// TODO add to `query` to connect the search panel here

	const data = {
		aggs,
		query,
		size: 0,
	};

	return authedRequest('POST', get(ctx.queryURL), {data});
}

const unfold = ({node, path = [], stack = []}) => {
	const {meta, ...result} = node;
	let newStack = [...stack]; // debug: immutable / Object.freeze?

	if (!meta.children) {
		newStack.push({
			path: [...path, meta],
			result
		});
	} else if ('buckets' in result) {
		const {buckets} = result;
		newStack.push({
			path: [...path, meta],
			result: {
				...result,
				buckets: _.map(buckets, _.skip(meta.children))
			}
		});

		_.forEach(meta.children, childAggId => {
			const childMeta = buckets[0][childAggId].meta;
			if (!childMeta.children) {
				newStack.push({
					path: [...path, meta, childMeta],
					result: _.map(buckets, bucket => ({
						key: bucket.key,
						result: _.skipIn(bucket[childAggId], ['meta'])
					}))
				});
			} else {
				_.forEach(buckets, bucket => {
					newStack = unfold({
						node: bucket[childAggId],
						path: [...path, {...meta, key: bucket.key}],
						stack: newStack
					});
				});
			}
		});
	}

	return newStack;
};

const updateQueueResults = (ctx, event) => {
	console.log('event.data.aggregations', event.data.aggregations);

	let newResults = [];
	_.forEach(_.values(event.data.aggregations), node => {
		newResults = unfold({
			node,
			path: [],
			stack: newResults
		});
	});
	console.log('newResults', newResults);

	ctx.queueResults.update(x => x.concat(newResults));
	console.log('queueResults', get(ctx.queueResults));

	return ctx;
};

const getError = (ctx, event) => {
	console.log('request failed with message:', event.data.jsonMessage)
	ctx.currentResult.set();
	return ctx;
}

/* options */

export const resultsOptions = {
	actions: {
		getError: assign(getError),
		initQueue: assign(initQueue),
		loadFromCache: assign(loadFromCache),
		resetQueue: assign(resetQueue),
		sendResultsUpdated: send('RESULTS_UPDATED'),
		setCacheKey: assign(setCacheKey),
		updateCache: assign(updateCache),
		updateCurrentResults: assign(updateCurrentResults),
		updateQueue: assign(updateQueue),
		updateQueueResults: assign(updateQueueResults),
	},
	guards: {
		hasQueuedAggs,
		isInCache,
		isMatching,
	},
	services: {
		apiRequest: ctx => requestQueuedAggs(ctx),
	}
};
