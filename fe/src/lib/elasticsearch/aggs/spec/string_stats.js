import {esSearchableString} from '$lib/elasticsearch/aggs/ref/typeGroups.js';
import {optional, script} from '$lib/elasticsearch/types/params.js';
import {booleanD, string} from '$lib/types/index.js';
import {
	field,
	missing,
	script as scriptDoc,
} from '$lib/elasticsearch/aggs/ref/requestDoc.js';
import response from '$lib/elasticsearch/aggs/response/stringStats.js';

export default {
	id: 'string_stats',
	availability: {
		from: '7.6'
	},
	docPath: '/search-aggregations-metrics-string-stats-aggregation.html',
	docs: 'Computes statistics over string values extracted from the aggregated documents',
	fieldType: esSearchableString,
	label: 'String Stats',
	request: { // [0]
		field: string,
		missing: optional(string),
		script: optional(script),
		show_distribution: optional(booleanD(false)),
	},
	requestDoc: {
		field,
		missing,
		show_distribution: 'TODO',
		script: scriptDoc,
	},
	response,
	tag: 'metric',
	version: '7.9',
};

// [0] 7.9: no params table
