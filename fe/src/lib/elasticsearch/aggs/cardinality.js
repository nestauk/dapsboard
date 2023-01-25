import {esSearchableField} from '$lib/elasticsearch/aggs/ref/typeGroups.js';
import {optional, script} from '$lib/elasticsearch/types/params.js';
import {integerD, string} from '$lib/types/index.js';
import {
	field,
	missing,
	script as scriptDoc,
} from '$lib/elasticsearch/aggs/ref/requestDoc.js';
import response from '$lib/elasticsearch/aggs/response/value.js';

export default {
	id: 'cardinality',
	availability: {
		from: '1.3'
	},
	docPath: '/search-aggregations-metrics-cardinality-aggregation.html',
	docs: 'Calculates an approximate count of distinct values.',
	fieldType: esSearchableField,
	label: 'Cardinality',
	request: { // [0]
		field: string,
		missing: optional(string), // [1]
		precision_threshold: optional(integerD(3000)),
		script: optional(script),
	},
	requestDoc: {
		field,
		missing,
		precision_threshold: 'Allows to trade memory for accuracy, and defines a unique count below which counts are expected to be close to accurate. Above this value, counts might become a bit more fuzzy. The maximum supported value is 40000, thresholds above this number will have the same effect as a threshold of 40000. The default value is 3000.',
		script: scriptDoc,
	},
	response,
	tag: 'metric',
	version: '7.9',
};

// [0] 7.9: no params table
// [1] TODO add constraint to be same type as the field type
