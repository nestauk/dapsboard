import {esNumeric} from 'elasticsearch/aggs/ref/typeGroups';
import {optional, script} from 'elasticsearch/types/params';
import {
	arrayOf,
	booleanD,
	integer,
	number,
	objectOf,
	string,
} from 'types';
import {
	keyed,
	field,
	missing,
	script as scriptDoc,
} from 'elasticsearch/aggs/ref/requestDoc';
import response from 'elasticsearch/aggs/response/numToNum';

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
