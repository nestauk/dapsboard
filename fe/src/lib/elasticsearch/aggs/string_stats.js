import {esSearchableString} from 'elasticsearch/aggs/ref/typeGroups';
import {optional, script} from 'elasticsearch/types/params';
import {booleanD, string} from 'types';
import {
	field,
	missing,
	script as scriptDoc,
} from 'elasticsearch/aggs/ref/requestDoc';
import response from 'elasticsearch/aggs/response/stringStats';

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
