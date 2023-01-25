import {esNumericButBoolean} from '$lib/elasticsearch/aggs/ref/typeGroups';
import {optional, script} from '$lib/elasticsearch/types/params';
import {string, number} from '$lib/types';
import {
	field,
	missing,
	script as scriptDoc
} from '$lib/elasticsearch/aggs/ref/requestDoc';
import response from '$lib/elasticsearch/aggs/response/value';

export default {
	id: 'avg',
	availability: {
		from: '1.3'
	},
	docPath: '/search-aggregations-metrics-avg-aggregation.html',
	docs: 'Computes the average of numeric values that are extracted from the aggregated documents.',
	fieldType: esNumericButBoolean,
	label: 'Average',
	request: { // [0]
		field: string,
		missing: optional(number),
		script: optional(script),
	},
	requestDoc: {
		field,
		missing,
		script: scriptDoc
	},
	response,
	tag: 'metric',
	version: '7.9',
};

// [0] 7.9: no params table
