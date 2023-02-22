import {esNumericButBoolean} from '$lib/elasticsearch/aggs/ref/typeGroups.js';
import {optional, script} from '$lib/elasticsearch/types/params.js';
import {string, number} from '$lib/types/index.js';
import {
	field,
	missing,
	script as scriptDoc,
} from '$lib/elasticsearch/aggs/ref/requestDoc.js';
import response from '$lib/elasticsearch/aggs/response/stats.js';

export default {
	id: 'stats',
	availability: {
		from: '1.3'
	},
	docPath: '/search-aggregations-metrics-stats-aggregation.html',
	docs: 'Computes stats over numeric values extracted from the aggregated documents.',
	fieldType: esNumericButBoolean,
	label: 'Stats',
	request: { // [0]
		field: string,
		missing: optional(number), // [1]
		script: optional(script),
	},
	requestDoc: {
		field,
		missing,
		script: scriptDoc,
	},
	response,
	tag: 'metric',
	version: '7.9',
};

// [0] 7.9: no params table
// [1] TODO add constraint to be same type as the field type
