import {esSearchableString} from '$lib/elasticsearch/aggs/ref/typeGroups.js';
import {
	enumsOf,
	integer,
	integerD,
	string,
} from '$lib/types/index.js';
import {
	optional,
	script,
	sortOptions,
	termsExclude,
	termsInclude,
} from '$lib/elasticsearch/types/params.js';
import {
	field,
	min_doc_count,
	missing,
	script as scriptDoc,
	termsExclude as termsExcludeDoc,
	termsInclude as termsIncludeDoc,
} from '$lib/elasticsearch/aggs/ref/requestDoc.js';
import response from '$lib/elasticsearch/aggs/response/bucketsTerms.js';

export default {
	id: 'terms',
	availability: {
		from: '1.3'
	},
	docPath: '/search-aggregations-bucket-terms-aggregation.html',
	docs: 'A multi-bucket value source based aggregation where buckets are dynamically built - one per unique value.',
	fieldType: esSearchableString,
	label: 'Terms',
	request: { // [0]
		/*
		* Per ES below, `breadth_first` is the default mode for fields with a cardinality
		* bigger than the requested size or when the cardinality is unknown
		* (numeric fields or scripts for instance).
		*/
		collect_mode: enumsOf(['depth_first', 'breadth_first'], 'depth_first'),
		exclude: optional(termsExclude),
		/*
		* Per ES below, `global_ordinals` is the default option for keyword field, it uses
		* global ordinals to allocate buckets dynamically so memory usage is linear to the
		* number of values of the documents that are part of the aggregation scope.
		*/
		execution_hint: enumsOf(['global_ordinals', 'map'], 'global_ordinals'),
		include: optional(termsInclude),
		field: string,
		min_doc_count: optional(integerD(1)),
		missing: optional(string),
		order: optional(sortOptions),
		script: optional(script),
		shard_size: optional(integer), // [1]
		size: optional(integerD(10)), // [1]
		// shard_min_doc_count: optional(integerD(0)), // [2]
	},
	requestDoc: {
		collect_mode: 'Deferring calculation of child aggregations.',
		exclude: termsExcludeDoc,
		execution_hint: 'Mechanisms by which terms aggregations can be executed.',
		field,
		include: termsIncludeDoc,
		min_doc_count,
		missing,
		order: 'The order of the buckets can be customized by setting the order parameter.',
		script: scriptDoc,
		shard_size: 'The volumes of candidate terms produced by each shard. `shard_size` cannot be smaller than `size` (as it doesn’t make much sense). When it is, Elasticsearch will override it and reset it to be equal to `size`. If `shard_size` is set to -1 (the default) then `shard_size` will be automatically estimated based on the number of shards and the `size` parameter.',
		size: 'How many term buckets should be returned out of the overall terms list.',
	},
	response,
	subAggs: true,
	tag: 'bucketing',
	version: '7.9',
};

/*
[0] 7.9: no params table
[1] `size` and `shard_size` are interrelated: https://www.elastic.co/guide/en/elasticsearch/reference/7.9/search-aggregations-bucket-significanttext-aggregation.html#sig-text-shard-size
[2] best not setting it explicitly, so even `optional(integerD(0))` seem dangerous
> Setting `min_doc_count=0` will also return buckets for terms that didn’t match any hit.
https://www.elastic.co/guide/en/elasticsearch/reference/7.9/search-aggregations-bucket-terms-aggregation.html#_minimum_document_count_4
*/
