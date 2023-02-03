import {optional, script} from '$lib/elasticsearch/types/params.js';
import {
	arrayOf,
	booleanD,
	number,
	objectOf,
	someOf,
	string,
} from '$lib/types/index.js';
import {field, keyed, script as scriptDoc} from '$lib/elasticsearch/aggs/ref/requestDoc.js';
import response from '$lib/elasticsearch/aggs/response/bucketsRange.js';

export default {
	id: 'range',
	availability: {
		from: '1.3'
	},
	docPath: '/search-aggregations-bucket-range-aggregation.html',
	docs: 'A multi-bucket value source based aggregation that enables the user to define a set of ranges - each representing a bucket.',
	fieldType: number,
	label: 'Range',
	needsParent: false,
	request: {// [0]
		field: string,
		keyed: optional(booleanD(false)),
		ranges: arrayOf(objectOf({
			key: optional(string),
			__extent: someOf({
				from: number,
				to: number,
			}),
		})),
		script: optional(script)
	},
	requestDoc: {
		field,
		keyed,
		ranges: 'Set of ranges, each representing a bucket.',
		script: scriptDoc
	},
	response,
	subAggs: true,
	tag: 'bucketing',
	version: '7.9',
};

// [0] 7.9: no params table
