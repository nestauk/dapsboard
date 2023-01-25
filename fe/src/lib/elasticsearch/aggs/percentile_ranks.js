import {esNumeric} from '$lib/elasticsearch/aggs/ref/typeGroups.js';
import {optional, script} from '$lib/elasticsearch/types/params.js';
import {
	arrayOf,
	booleanD,
	integer,
	number,
	objectOf,
	string,
} from '$lib/types/index.js';
import {
	keyed,
	field,
	missing,
	script as scriptDoc,
} from '$lib/elasticsearch/aggs/ref/requestDoc.js';
import response from '$lib/elasticsearch/aggs/response/numToNum.js';

export default {
	id: 'percentile_ranks',
	availability: {
		from: '1.3'
	},
	docPath: '/search-aggregations-metrics-percentile-rank-aggregation.html',
	docs: 'Calculates one or more percentile ranks over numeric values extracted from the aggregated documents.',
	fieldType: esNumeric,
	label: 'Percentile Ranks',
	request: { // [0]
		field: string,
		hdr: optional(objectOf({
			number_of_significant_value_digits: integer
		})),
		keyed: optional(booleanD(true)),
		missing: optional(number),
		script: optional(script),
		values: arrayOf(number),
	},
	requestDoc: {
		field,
		hdr: '(High Dynamic Range Histogram) is an alternative implementation that can be useful when calculating percentile ranks for latency measurements as it can be faster than the t-digest implementation with the trade-off of a larger memory footprint.',
		keyed,
		missing,
		script: scriptDoc,
		values: 'List of treshold values to use for ranking.',
	},
	response,
	tag: 'metric',
	version: '7.9',
};

// [0] 7.9: no params table
