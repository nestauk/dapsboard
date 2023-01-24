import {esSearchableField} from '$lib/elasticsearch/aggs/ref/typeGroups.js';
import {optional, script} from '$lib/elasticsearch/types/params.js';
import {string} from '$lib/types/index.js';
import {field, script as scriptDoc} from '$lib/elasticsearch/aggs/ref/requestDoc.js';
import response from '$lib/elasticsearch/aggs/response/value.js';

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
