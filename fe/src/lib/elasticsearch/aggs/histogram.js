import {
	booleanD,
	extent,
	integer,
	integerD,
	number,
	string,
} from '$lib/types/index.js';
import {optional, sortOptions} from '$lib/elasticsearch/types/params.js';
import {
	field,
	keyed,
	min_doc_count,
	missing
} from '$lib/elasticsearch/aggs/ref/requestDoc.js';
import response from '$lib/elasticsearch/aggs/response/bucketsDocCount.js';

export default {
	id: 'histogram',
	availability: {
		from: '1.3'
	},
	docPath: '/search-aggregations-bucket-histogram-aggregation.html',
	docs: 'A multi-bucket values source based aggregation that can be applied on numeric values extracted from the documents.',
	fieldType: number,
	label: 'Histogram',
	request: { // [0]
		extended_bounds: optional(extent),
		field: string,
		interval: integer,
		keyed: optional(booleanD(false)),
		min_doc_count: optional(integerD(1, true)),
		missing: optional(number), // [1]
		offset: optional(integerD(0)),
		order: optional(sortOptions),
	},
	requestDoc: {
		extended_bounds: 'With extended_bounds setting, you now can "force" the histogram aggregation to start building buckets on a specific min value and also keep on building buckets up to a max value (even if there are no documents anymore). Using extended_bounds only makes sense when `min_doc_count` is 0 (the empty buckets will never be returned if `min_doc_count` is greater than 0).',
		field,
		interval: 'When the aggregation executes, the selected field of every document will be evaluated and will be rounded down to its closest bucket. Must be a positive decimal.',
		keyed,
		min_doc_count,
		missing,
		offset: 'Shifts bucket boundaries. Must be a decimal greater than or equal to 0 and less than interval.',
		order: 'The order of the buckets can be customized by setting the order parameter. ',
	},
	response,
	tag: 'bucketing',
	version: '7.9',
};

// [0] 7.9: no params table
// [1] TODO add constraint to be same type as the field type
