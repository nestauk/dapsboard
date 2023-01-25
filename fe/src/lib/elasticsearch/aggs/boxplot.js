import {optional, script} from '$lib/elasticsearch/types/params';
import {integerD, number, string} from '$lib/types';
import {
	field,
	missing,
	script as scriptDoc
} from '$lib/elasticsearch/aggs/ref/requestDoc';
import response from '$lib/elasticsearch/aggs/response/boxplot';

export default {
	id: 'boxplot',
	availability: {
		from: '7.7'
	},
	docPath: '/search-aggregations-metrics-boxplot-aggregation.html',
	docs: 'Computes boxplot of numeric values extracted from the aggregated documents. ',
	fieldType: number,
	label: 'Boxplot',
	request: { // [0]
		compression: optional(integerD(100)),
		field: string,
		missing: optional(number),
		script: optional(script)
	},
	requestDoc: {
		compression: 'Approximate algorithms must balance memory utilization with estimation accuracy. This balance can be controlled using a compression parameter.',
		field,
		missing,
		script: scriptDoc
	},
	response,
	tag: 'metric',
	version: '7.9',
};

// [0] 7.9: no params table
