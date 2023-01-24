import {esSearchableString} from 'elasticsearch/aggs/ref/typeGroups';
import {
	optional,
	termsExclude,
	termsInclude,
} from 'elasticsearch/types/params';
import {
	floatD,
	integerD,
	string,
} from 'types';
import {
	field,
	missing,
	termsExclude as termsExcludeDoc,
	termsInclude as termsIncludeDoc,
} from 'elasticsearch/aggs/ref/requestDoc';
import response from 'elasticsearch/aggs/response/bucketsDocCount';

export default {
	id: 'rare_terms',
	availability: {
		from: '7.3'
	},
	collect_mode: `breadth_first`,
	docPath: '/search-aggregations-bucket-rare-terms-aggregation.html',
	docs: 'Multi-bucket value source based aggregation which finds "rare" terms - terms that are at the long-tail of the distribution and are not frequent.',
	fieldType: esSearchableString,
	label: 'Rare terms',
	request: { // [1]
		exclude: optional(termsExclude),
		field: string,
		include: optional(termsInclude),
		max_doc_count: optional(integerD(1)),
		missing: optional(string),
		precision: optional(floatD(0.01)),
	},
	requestDoc: {
		exclude: termsExcludeDoc,
		field,
		include: termsIncludeDoc,
		max_doc_count: 'The maximum number of documents a term should appear in.',
		missing,
		precision: 'The precision of the internal CuckooFilters. Smaller precision leads to better approximation, but higher memory usage. Cannot be smaller than 0.00001. Default 0.01',
	},
	response,
	tag: 'bucketing',
	version: '7.9',
};

// [1] params table at: https://www.elastic.co/guide/en/elasticsearch/reference/7.9/search-aggregations-bucket-rare-terms-aggregation.html#_syntax
