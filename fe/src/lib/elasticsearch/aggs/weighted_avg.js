import {esNumericButBoolean} from '$lib/elasticsearch/aggs/ref/typeGroups';
import {optional, script} from '$lib/elasticsearch/types/params';
import {
	object,
	objectOf,
	string,
	number
} from '$lib/types';
import {missing, script as scriptDoc} from '$lib/elasticsearch/aggs/ref/requestDoc';
import response from '$lib/elasticsearch/aggs/response/value';

export default {
	id: 'weighted_avg',
	availability: {
		from: '6.4'
	},
	docPath: '/search-aggregations-metrics-weight-avg-aggregation.html',
	docs: 'Computes the weighted average of numeric values that are extracted from the aggregated documents.',
	fieldType: esNumericButBoolean,
	label: 'Weighted Average',
	request: { // [0]
		format: optional(object),
		value_type: optional(object),
		value: objectOf({
			field: string,
			missing: optional(number), // [1]
			script: optional(script),
		}),
		weight: objectOf({
			field: string,
			missing: optional(number), // [1]
			script: optional(script),
		}),
	},
	requestDoc: {
		format: 'The numeric response formatter.',
		value_type: 'A hint about the values for pure scripts or unmapped fields.',
		value: 'The configuration for the field or script that provides the values',
		'value.field': 'The field that values should be extracted from.',
		'value.missing': missing,
		'value.script': scriptDoc,
		weight: 'The configuration for the field or script that provides the weights',
		'weight.field': 'The field that values should be extracted from.',
		'weight.missing': missing,
		'weight.script': scriptDoc,
	},
	response,
	tag: 'metric',
	version: '7.9',
};

// [0] 7.9: params table at https://www.elastic.co/guide/en/elasticsearch/reference/7.9/search-aggregations-metrics-weight-avg-aggregation.html#search-aggregations-metrics-weight-avg-aggregation
// [1] TODO add constraint to be same type as the field type
