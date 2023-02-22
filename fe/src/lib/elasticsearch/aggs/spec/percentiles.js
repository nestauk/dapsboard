import {esNumericButBoolean} from '$lib/elasticsearch/aggs/ref/typeGroups.js';
import {optional, script} from '$lib/elasticsearch/types/params.js';
import {
	arrayOf,
	booleanD,
	float,
	integer,
	integerD,
	objectOf,
	string,
	number
} from '$lib/types/index.js';
import {
	field,
	keyed,
	missing,
	script as scriptDoc,
} from '$lib/elasticsearch/aggs/ref/requestDoc.js';
import response from '$lib/elasticsearch/aggs/response/numToNum.js';

export default {
	id: 'percentiles',
	availability: {
		from: '1.3'
	},
	docPath: '/search-aggregations-metrics-percentile-aggregation.html',
	docs: 'Calculates one or more percentiles over numeric values extracted from the aggregated documents.',
	fieldType: esNumericButBoolean,
	label: 'Percentiles',
	request: { // [0]
		field: string,
		hdr: optional(objectOf({
			number_of_significant_value_digits: integer
		})),
		keyed: optional(booleanD(true)),
		missing: optional(number), // [1]
		percents: optional(arrayOf(float, [1, 5, 25, 50, 75, 95, 99])),
		script: optional(script),
		tdigest: optional(objectOf({
			compression: integerD(100)
		})),
	},
	requestDoc: {
		field,
		hdr: 'hdr object indicates that HDR Histogram should be used to calculate the percentiles and specific settings for this algorithm can be specified inside the object. Format: {number_of_significant_value_digits: integer}',
		keyed,
		missing,
		percents: 'List of treshold values to use for ranking.',
		script: scriptDoc,
		tdigest: 'Format: {compression: integer}: The compression parameter limits the maximum number of nodes to 20 * compression.',
	},
	response,
	tag: 'metric',
	version: '7.9',
};

// [0] 7.9: no params table
// [1] TODO add constraint to be same type as the field type
