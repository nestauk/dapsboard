import * as _ from 'lamb';
import JSONTree from 'svelte-json-tree';
import {BarchartVDiv} from '@svizzle/barchart';
import {applyFnMap, makeWithKeys} from '@svizzle/utils';

import aggToResponseType from '../../elasticsearch/aggs/ref/aggToResponseType.yaml';
import Location from '../components/views/Location.svelte';
import Number from '../components/views/Number.svelte';

const getEmptyObject = _.always(null);
const getLabelFromOrigin = _.getKey('aggId');

const getKey = _.getKey('key');
const getValue = _.getKey('value');
const getDocCount = _.getKey('doc_count');
const getLocation = _.getKey('location');

const buildLabelProp = applyFnMap({label: getLabelFromOrigin});
const getJSONTreeProps = applyFnMap({value: _.identity});

const bucketsToBarchartItems = _.pipe([
	_.getKey('buckets'),
	_.mapWith(applyFnMap({
		key: getKey,
		value: getDocCount
	}))
]);

const resultsMap = {
	boxplot: {
		component: JSONTree,
		transformResult: getJSONTreeProps,
		transformOrigin: getEmptyObject
	},
	buckets_date: {
		component: JSONTree,
		transformResult: getJSONTreeProps,
		transformOrigin: getEmptyObject
	},
	buckets_date_range: {
		component: JSONTree,
		transformResult: getJSONTreeProps,
		transformOrigin: getEmptyObject
	},
	buckets_geohash_grid: {
		component: JSONTree,
		transformResult: getJSONTreeProps,
		transformOrigin: getEmptyObject
	},
	buckets_geotile_grid: {
		component: JSONTree,
		transformResult: getJSONTreeProps,
		transformOrigin: getEmptyObject
	},
	buckets_number: {
		component: JSONTree,
		transformResult: getJSONTreeProps,
		transformOrigin: getEmptyObject
	},
	buckets_range: {
		component: JSONTree,
		transformResult: getJSONTreeProps,
		transformOrigin: getEmptyObject
	},
	buckets_terms: {
		component: BarchartVDiv,
		transformResult: (/** @type {any} */ aggResult) => ({
			items: bucketsToBarchartItems(aggResult)
		}),
		transformOrigin: getEmptyObject
	},
	buckets_text_score: {
		component: BarchartVDiv,
		transformResult: (/** @type {any} */ aggResult) => ({
			items: bucketsToBarchartItems(aggResult)
		}),
		transformOrigin: getEmptyObject
	},
	doc_count: {
		component: Number,
		transformResult: applyFnMap({value: getDocCount}),
		transformOrigin: buildLabelProp
	},
	extended_stats: {
		component: JSONTree,
		transformResult: getJSONTreeProps,
		transformOrigin: getEmptyObject
	},
	geo_bounds: {
		component: JSONTree,
		transformResult: getJSONTreeProps,
		transformOrigin: getEmptyObject
	},
	geo_centroid: {
		component: Location,
		transformResult: applyFnMap({location: getLocation}),
		transformOrigin: getEmptyObject
	},
	hits: {
		component: JSONTree,
		transformResult: getJSONTreeProps,
		transformOrigin: getEmptyObject
	},
	numkeyToNum: {
		component: JSONTree,
		transformResult: getJSONTreeProps,
		transformOrigin: getEmptyObject
	},
	stats: {
		component: JSONTree,
		transformResult: getJSONTreeProps,
		transformOrigin: getEmptyObject
	},
	string_stats: {
		component: JSONTree,
		transformResult: getJSONTreeProps,
		transformOrigin: getEmptyObject
	},
	top: {
		component: JSONTree,
		transformResult: getJSONTreeProps,
		transformOrigin: getEmptyObject
	},
	value: {
		component: Number,
		transformResult: applyFnMap({value: getValue}),
		transformOrigin: buildLabelProp
	},
};

const parseAggKey = _.pipe([
	_.splitBy('.'),
	makeWithKeys(['datasetId', 'fieldName', 'aggId', 'responseId']),
]);

export const getComponent = (/** @type {any} */ aggKey, /** @type {any} */ aggResult) => {
	const origin = parseAggKey(aggKey);
	const {aggId} = origin;
	const responseType = aggToResponseType[aggId];
	if (!(responseType in resultsMap)) {
		throw new Error(`Unknown response type ${responseType} for agg ${origin.aggId}`);
	}
	const resultSpec = resultsMap[responseType];
	const {component} = resultSpec;
	return {
		component,
		resultProps: resultSpec.transformResult(aggResult),
		keyProps: resultSpec.transformOrigin(origin),
		origin
	}
}
