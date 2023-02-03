import {esStrings} from '$lib/elasticsearch/aggs/ref/typeGroups.js';
import {
	optional,
	termsExclude,
	termsInclude,
} from '$lib/elasticsearch/types/params.js';
import {
	arrayOf,
	booleanD,
	integer,
	integerD,
	object,
	objectOf,
	string
} from '$lib/types/index.js';
import {
	background_filter,
	field,
	min_doc_count,
	termsExclude as termsExcludeDoc,
	termsInclude as termsIncludeDoc,
} from '$lib/elasticsearch/aggs/ref/requestDoc.js';
import response from '$lib/elasticsearch/aggs/response/bucketsTextScore.js';

export default {
	id: 'significant_text',
	availability: {
		from: '6.0'
	},
	docPath: '/search-aggregations-bucket-significanttext-aggregation.html',
	docs: 'An aggregation that returns interesting or unusual occurrences of free-text terms in a set.',
	fieldType: esStrings,
	label: 'Significant Text',
	request: { // [0]
		background_filter: optional(objectOf({term: object})),
		exclude: optional(termsExclude),
		field: string,
		filter_duplicate_text: optional(booleanD(false)),
		include: optional(termsInclude),
		min_doc_count: optional(integerD(3)),
		shard_size: optional(integer), // [1]
		size: optional(integerD(10)), // [1]
		source_fields: optional(arrayOf(string))
	},
	requestDoc: {
		background_filter,
		exclude: termsExcludeDoc,
		field,
		filter_duplicate_text: 'Filtering near-duplicate text is a difficult task at index-time but we can cleanse the data on-the-fly at query time using the `filter_duplicate_text` setting.',
		include: termsIncludeDoc,
		min_doc_count,
		source_fields: 'List of JSON _source fields from which text will be analyzed.',
		shard_size: 'The volumes of candidate terms produced by each shard. `shard_size` cannot be smaller than `size` (as it doesn’t make much sense). When it is, Elasticsearch will override it and reset it to be equal to `size`. If `shard_size` is set to -1 (the default) then `shard_size` will be automatically estimated based on the number of shards and the `size` parameter.',
		size: 'How many term buckets should be returned out of the overall terms list.',
	},
	response,
	subAggs: false, // [2]
	tag: 'bucketing',
	version: '7.9',
};

// [0] 7.9: no params table
// [1] `size` and `shard_size` are interrelated: https://www.elastic.co/guide/en/elasticsearch/reference/7.9/search-aggregations-bucket-significanttext-aggregation.html#sig-text-shard-size
// [2] {"error":{"root_cause":[{"type":"aggregation_initialization_exception","reason":"Aggregator [mosaic_nih_v5.id_iso2_country.significant_text.buckets_text_score] of type [significant_text] cannot accept sub-aggregations"}],"type":"aggregation_initialization_exception","reason":"Aggregator [mosaic_nih_v5.id_iso2_country.significant_text.buckets_text_score] of type [significant_text] cannot accept sub-aggregations"},"status":500}
