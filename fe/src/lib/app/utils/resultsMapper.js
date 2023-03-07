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
import Location from '../components/explore/viz/displays/Location.svelte';
import NumberDisplay from '../components/explore/viz/displays/ValueDisplay.svelte';
import ObjectDisplay from '../components/explore/viz/displays/ObjectDisplay.svelte';

const getEmptyObject = _.always(null);
const getLabelFromOrigin = _.getKey('aggId');

const getLabelProp = applyFnMap({label: getLabelFromOrigin});
// const getTitleProp = applyFnMap({title: getLabelFromOrigin});
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
const bucketsToHistogramItems = interval => _.pipe([
	_.getKey('buckets'),
	_.mapWith(_.collect([getKey, getDocCount])),
	_.mapWith(([key, value], i, arr) => {
		const nextKey = arr[i + 1]?.[0];
		const endRange = nextKey ? nextKey : key + interval;

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
		transformMeta: getEmptyObject
	},
	buckets_date: {
		component: JSONTree,
		transformResult: getJSONTreeProps,
		transformMeta: getEmptyObject
	},
	buckets_date_range: {
		component: JSONTree,
		transformResult: getJSONTreeProps,
		transformMeta: getEmptyObject
	},
	buckets_geohash_grid: {
		component: JSONTree,
		transformResult: getJSONTreeProps,
		transformMeta: getEmptyObject
	},
	buckets_geotile_grid: {
		component: JSONTree,
		transformResult: getJSONTreeProps,
		transformMeta: getEmptyObject
	},
	buckets_number: {
		component: Histogram,
		transformResult: (aggResult, request) => ({
			bins: bucketsToHistogramItems(request.interval)(aggResult),
			width: 200,
			height: 600,
		}),
		transformMeta: getEmptyObject
	},
	buckets_range: {
		component: JSONTree,
		transformResult: getJSONTreeProps,
		transformMeta: getEmptyObject
	},
	buckets_terms: {
		component: BarchartVDiv,
		transformResult: aggResult => ({
			items: bucketsToBarchartItems(aggResult)
		}),
		transformMeta: getEmptyObject
	},
	buckets_text_score: {
		component: BarchartVDiv,
		transformResult: aggResult => ({
			items: bucketsToBarchartItems(aggResult)
		}),
		transformMeta: getEmptyObject
	},
	doc_count: {
		component: NumberDisplay,
		transformResult: applyFnMap({value: getDocCount}),
		transformMeta: getLabelProp
	},
	extended_stats: {
		component: ObjectDisplay,
		transformResult: getStatsProps,
		transformMeta: getLabelProp
	},
	geo_bounds: {
		component: JSONTree,
		transformResult: getJSONTreeProps,
		transformMeta: getEmptyObject
	},
	geo_centroid: {
		component: Location,
		transformResult: applyFnMap({location: getLocation}),
		transformMeta: getEmptyObject
	},
	hits: {
		component: JSONTree,
		transformResult: getJSONTreeProps,
		transformMeta: getEmptyObject
	},
	numkeyToNum: {
		component: JSONTree,
		transformResult: getJSONTreeProps,
		transformMeta: getEmptyObject
	},
	stats: {
		component: ObjectDisplay,
		transformResult: getStatsProps,
		transformMeta: getLabelProp
	},
	string_stats: {
		component: JSONTree,
		transformResult: getJSONTreeProps,
		transformMeta: getEmptyObject
	},
	top: {
		component: JSONTree,
		transformResult: getJSONTreeProps,
		transformMeta: getEmptyObject
	},
	value: {
		component: NumberDisplay,
		transformResult: applyFnMap({value: getValue}),
		transformMeta: getLabelProp
	},
};

const defaultComponent = {
	component: JSONTree,
	transformResult: applyFnMap({value: getValue}),
	transformMeta: getLabelProp
}

const transformResult = aggResult => ({
	buckets: aggResult.map(({key, result}) => ({
		key,
		doc_count: result.value || result.doc_count
	}))
})
const transformResult2 = agg => {
	let {result} = agg;
	if (result?.[0]?.result) {
		result = transformResult(result);
	}
	return {
		...agg,
		result
	}
}

export const getComponentConfig = (meta, result) => {
	const {aggId} = meta;
	const responseType = aggToResponseType[aggId];
	if (!(responseType in resultsMap)) {
		console.log(`Unknown response type ${responseType} for agg ${meta.aggId}, using JSONTree.`);
	}
	const resultSpec = resultsMap[responseType] || defaultComponent;
	const {component} = resultSpec;
	return {
		component,
		keyProps: resultSpec.transformMeta(meta),
		resultProps: resultSpec.transformResult(result, meta.request),
	}
}

export const singleValueResponseIds = Object.freeze([
	'doc_count',
	'value'
]);
export const compoundValueResponseIds = Object.freeze([
	'numkeyToNum',
	'extended_stats',
	'percentile_ranks',
	'stats'
]);

const getResponseId = path => path[path.length - 1].responseId;

const belongsToSingleField = path =>
	path.length === 1 || singleValueResponseIds.includes(getResponseId(path));

const belongsToSingleValue = path =>
	singleValueResponseIds.includes(path[0].responseId);

const belongsToCompoundValue = path =>
	compoundValueResponseIds.includes(path[0].responseId);

const isSingleFieldResponse = ({path}) => belongsToSingleField(path);

const isSingleValueResponse = ({path}) => belongsToSingleValue(path);
const isCompoundValueResponse = ({path}) => belongsToCompoundValue(path);
const getFieldName = ({fieldName}) => fieldName;
const getResultGroup = ({path}) => path.map(getFieldName).join(', ');

export const getSingleValueAggs = _.filterWith(isSingleValueResponse);
export const getCompoundValueAggs = _.filterWith(isCompoundValueResponse);

export const getChartedAggs = _.filterWith(
	({path}) => !belongsToSingleValue(path) && !belongsToCompoundValue(path)
);

export const getResultsByFieldSets = results => {
	const [singleFieldResults, compoundFieldResults] = _.partition(
		results,
		isSingleFieldResponse
	);
	const singleFieldGroups = _.pipe([
		_.mapWith(transformResult2),
		_.groupBy(({path: [{fieldName}]}) => fieldName),
	])(singleFieldResults);

	console.log('singleFieldGroups', singleFieldGroups);
	const compoundFieldGroups = _.group(
		compoundFieldResults,
		getResultGroup
	);
	console.log('compoundFieldGroups', compoundFieldGroups);
	return _.pairs({
		...singleFieldGroups,
		...compoundFieldGroups
	})
}

const getSummary = ({fieldName, aggId, responseId}) => `${fieldName}:${aggId}:${responseId}`;
export const getSummaries = path => path.map(getSummary).join(' > ');
