import {esNumeric} from '$lib/elasticsearch/aggs/ref/typeGroups';
import {optional, script} from '$lib/elasticsearch/types/params';
import {
	enumsOf,
	object,
	objectOf,
	string
} from '$lib/types';
import response from '$lib/elasticsearch/aggs/response/value';

export default {
	id: 't_test',
	availability: {
		from: '7.8'
	},
	docPath: '/search-aggregations-metrics-ttest-aggregation.html',
	docs: 'Performs a statistical hypothesis test in which the test statistic follows a Student’s t-distribution under the null hypothesis on numeric values.',
	fieldType: esNumeric,
	label: 'T-test',
	request: { // [0]
		a: objectOf({
			field: string,
			filter: optional(object),
			script: optional(script),
		}),
		b: objectOf({
			field: string,
			filter: optional(object),
			script: optional(script),
		}),
		type: enumsOf(['paired', 'homoscedastic', 'heteroscedastic'])
	},
	requestDoc: {
		a: 'First test.',
		'a.field': 'Field of numeric type for the first test.',
		'a.filter': 'Filter for the first test.',
		'a.script': 'Script for the first test.',
		b: 'Second test.',
		'b.field': 'First field of numeric type for the second test.',
		'b.filter': 'Filter for the second test.',
		'c.script': 'Script for the first test.',
		type: 'The type of the test can be specified using the type parameter.',
	},
	response: {
		...response,
		doc: {
			value: 'The probability value for the test.'
		},
		docLong: {
			value: 'It is the probability of obtaining results at least as extreme as the result processed by the aggregation, assuming that the null hypothesis is correct (which means there is no difference between population means). Smaller p-value means the null hypothesis is more likely to be incorrect and population means are indeed different.'
		}
	},
	tag: 'metric',
	version: '7.9',
};

// [0] 7.9: no params table
