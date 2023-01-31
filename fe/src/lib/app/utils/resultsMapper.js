import * as _ from 'lamb';
import JSONTree from 'svelte-json-tree';
import {BarchartVDiv} from '@svizzle/barchart';
import {
	applyFnMap,
	getKey,
	getValue,
	makeWithKeys
} from '@svizzle/utils';

import {getDocCount, getLocation} from '../../utils/specs.js';
import aggToResponseType from '../../elasticsearch/aggs/ref/aggToResponseType.js';

import Histogram from '../components/svizzle/HistogramDiv.svelte';
import Location from '../components/views/Location.svelte';
import NumberDisplay from '../components/views/NumberDisplay.svelte';
import Stats from '../components/views/Stats.svelte';

const getEmptyObject = _.always(null);
const getLabelFromOrigin = _.getKey('aggId');

const getLabelProp = applyFnMap({label: getLabelFromOrigin});
const getTitleProp = applyFnMap({title: getLabelFromOrigin});
const getJSONTreeProps = applyFnMap({value: _.identity});
const getStatsProps = applyFnMap({stats: _.identity});

const bucketsToBarchartItems = _.pipe([
	_.getKey('buckets'),
	_.mapWith(applyFnMap({
		key: getKey,
		value: getDocCount
	}))
]);

// gets `key` property in each array item and returns an
// equivalent range with output format: [key, difference with next key]
// input format of each array item is {key, doc_count}
const bucketsToHistogramItems = _.pipe([
	_.getKey('buckets'),
	_.mapWith(_.collect([getKey, getDocCount])),
	_.mapWith(([key, value], i, arr) => {
		const [[firstItem], [secondItem]] = arr;
		const firstDifference = secondItem ? secondItem - firstItem : null;

		const nextKey = arr[i + 1]?.[0];
		const endRange = nextKey ? nextKey : key + firstDifference;

		return {
			range: [key, endRange],
			value
		};
	})
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
		component: Histogram,
		transformResult: aggResult => ({
			bins: bucketsToHistogramItems(aggResult),
			width: 200,
			height: 600,
		}),
		transformOrigin: getEmptyObject
	},
	buckets_range: {
		component: JSONTree,
		transformResult: getJSONTreeProps,
		transformOrigin: getEmptyObject
	},
	buckets_terms: {
		component: BarchartVDiv,
		transformResult: aggResult => ({
			items: bucketsToBarchartItems(aggResult)
		}),
		transformOrigin: getEmptyObject
	},
	buckets_text_score: {
		component: BarchartVDiv,
		transformResult: aggResult => ({
			items: bucketsToBarchartItems(aggResult)
		}),
		transformOrigin: getEmptyObject
	},
	doc_count: {
		component: NumberDisplay,
		transformResult: applyFnMap({value: getDocCount}),
		transformOrigin: getLabelProp
	},
	extended_stats: {
		component: Stats,
		transformResult: getStatsProps,
		transformOrigin: getLabelProp
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
		component: Stats,
		transformResult: getStatsProps,
		transformOrigin: getLabelProp
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
		component: NumberDisplay,
		transformResult: applyFnMap({value: getValue}),
		transformOrigin: getLabelProp
	},
};

const defaultComponent = {
	component: JSONTree,
	transformResult: applyFnMap({value: getValue}),
	transformOrigin: getLabelProp
}

const parseAggKey = _.pipe([
	_.splitBy('.'),
	makeWithKeys(['datasetId', 'fieldName', 'aggId', 'responseId']),
]);

export const getComponentConfig = (aggKey, aggResult) => {
	const origin = parseAggKey(aggKey);
	const {aggId} = origin;
	const responseType = aggToResponseType[aggId];
	if (!(responseType in resultsMap)) {
		console.log(`Unknown response type ${responseType} for agg ${origin.aggId}, using JSONTree.`);
	}
	const resultSpec = resultsMap[responseType] || defaultComponent;
	const {component} = resultSpec;
	return {
		component,
		keyProps: resultSpec.transformOrigin(origin),
		origin,
		resultProps: resultSpec.transformResult(aggResult),
	}
}
