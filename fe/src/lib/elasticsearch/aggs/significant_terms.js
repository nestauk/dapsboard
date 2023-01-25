import {esSearchableString} from '$lib/elasticsearch/aggs/ref/typeGroups';
import {
	optional,
	script,
	termsExclude,
	termsInclude,
} from '$lib/elasticsearch/types/params';
import {
	boolean,
	integerD,
	integer,
	object,
	objectD,
	objectOf,
	string
} from '$lib/types';
import {
	background_filter,
	field,
	min_doc_count,
	script as scriptDoc,
	termsExclude as termsExcludeDoc,
	termsInclude as termsIncludeDoc,
} from '$lib/elasticsearch/aggs/ref/requestDoc';
import response from '$lib/elasticsearch/aggs/response/bucketsTextScore';

export default {
	id: 'significant_terms',
	availability: {
		from: '1.3'
	},
	collect_mode: `breadth_first`,
	docPath: '/search-aggregations-bucket-significantterms-aggregation.html',
	docs: 'An aggregation that returns interesting or unusual occurrences of terms in a set.',
	fieldType: esSearchableString,
	label: 'Significant Terms',
	request: { // [0]
		background_filter: optional(objectOf({term: object})),
		chi_square: optional(objectD({})), // [1]
		exclude: optional(termsExclude),
		field: string,
		gnd: optional(objectD({})), // [1]
		include: optional(termsInclude),
		jlh: optional(objectD({})), // [1]
		min_doc_count: optional(integerD(3)),
		mutual_information: optional(objectOf({
			include_negatives: optional(boolean),
			background_is_superset: optional(boolean)
		})),
		percentage: optional(objectD({})), // [1]
		script: optional(script),
		shard_size: optional(integer), // [2]
		size: optional(integerD(10)), // [2]
	},
	requestDoc: {
		background_filter,
		chi_square: 'Chi square as described in "Information Retrieval", Manning et al., Chapter 13.5.2 can be used as significance score by adding `{}`',
		exclude: termsExcludeDoc,
		field,
		gnd: 'Google normalized distance as described in "The Google Similarity Distance", Cilibrasi and Vitanyi, 2007 (http://arxiv.org/pdf/cs/0412098v3.pdf) can be used as significance score by adding `{}`',
		include: termsIncludeDoc,
		jlh: 'The JLH score can be used as a significance score by adding `{}`.',
		min_doc_count,
		mutual_information: 'Mutual information as described in "Information Retrieval", Manning et al., Chapter 13.5.1 can be used as significance score by adding `{}`',
		percentage: 'A simple calculation of the number of documents in the foreground sample with a term divided by the number of documents in the background with the term. By default this produces a score greater than zero and less than one.',
		script: scriptDoc,
		shard_size: 'The volumes of candidate terms produced by each shard. `shard_size` cannot be smaller than `size` (as it doesn’t make much sense). When it is, Elasticsearch will override it and reset it to be equal to `size`. If `shard_size` is set to -1 (the default) then `shard_size` will be automatically estimated based on the number of shards and the `size` parameter.',
		size: 'How many term buckets should be returned out of the overall terms list.',
	},
	response,
	tag: 'bucketing',
	version: '7.9',
};

// [0] 7.9: no params table
// [1] TODO later (#201), `chi_square`, `gnd`, `jlh`, `percentage` are xor'ed see `__algorithms`
// [2] `size` and `shard_size` are interrelated: https://www.elastic.co/guide/en/elasticsearch/reference/7.9/search-aggregations-bucket-significantterms-aggregation.html#sig-terms-shard-size
