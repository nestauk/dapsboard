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
	id: 'max',
	availability: {
		from: '1.3'
	},
	docPath: '/search-aggregations-metrics-max-aggregation.html',
	docs: 'Returns the maximum value among the numeric values extracted from the aggregated documents.',
	fieldType: esNumericButBoolean,
	label: 'Max',
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
