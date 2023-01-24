import {esNumericButBoolean} from 'elasticsearch/aggs/ref/typeGroups';
import {optional, script} from 'elasticsearch/types/params';
import {string, number} from 'types';
import {
	field,
	missing,
	script as scriptDoc,
} from 'elasticsearch/aggs/ref/requestDoc';
import response from 'elasticsearch/aggs/response/value';

export default {
	id: 'sum',
	availability: {
		from: '1.3'
	},
	docPath: '/search-aggregations-metrics-sum-aggregation.html',
	docs: 'Sums up numeric values that are extracted from the aggregated documents.',
	fieldType: esNumericButBoolean,
	label: 'Sum',
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
