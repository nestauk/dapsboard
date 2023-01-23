import {esNumericButBoolean} from 'elasticsearch/aggs/ref/typeGroups';
import {optional, script} from 'elasticsearch/types/params';
import {string, number} from 'types';
import {
	field,
	missing,
	script as scriptDoc,
} from 'elasticsearch/aggs/ref/requestDoc';
import response from 'elasticsearch/aggs/response/stats';

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
