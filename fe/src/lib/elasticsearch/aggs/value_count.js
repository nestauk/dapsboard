import {esSearchableField} from '$lib/elasticsearch/aggs/ref/typeGroups';
import {optional, script} from '$lib/elasticsearch/types/params';
import {string} from '$lib/types';
import {field, script as scriptDoc} from '$lib/elasticsearch/aggs/ref/requestDoc';
import response from '$lib/elasticsearch/aggs/response/value';

export default {
	id: 'value_count',
	availability: {
		from: '1.3'
	},
	docPath: '/search-aggregations-metrics-valuecount-aggregation.html',
	docs: 'Counts the number of values that are extracted from the aggregated documents.',
	fieldType: esSearchableField,
	label: 'Value Count',
	request: { // [0]
		field: string,
		script: optional(script),
	},
	requestDoc: {
		field,
		script: scriptDoc,
	},
	response,
	tag: 'metric',
	version: '7.9',
};

// [0] 7.9: no params table
