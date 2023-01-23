import {esSearchableField} from '$lib/elasticsearch/aggs/ref/typeGroups';
import {optional} from '$lib/elasticsearch/types/params';
import {enumsOf, integerD, string} from '$lib/types';
import {missing} from '$lib/elasticsearch/aggs/ref/requestDoc';

export default {
	id: 'diversified_sampler',
	availability: {
		from: '5.0'
	},
	docPath: '/search-aggregations-bucket-diversified-sampler-aggregation.html',
	docs: 'Like the sampler aggregation this is a filtering aggregation used to limit any sub aggregations processing to a sample of the top-scoring documents. The diversified_sampler aggregation adds the ability to limit the number of matches that share a common value such as an "author".',
	fieldType: esSearchableField,
	label: 'Diversified Sampler',
	request: {
		execution_hint: optional(
			enumsOf(['map', 'global_ordinals', 'bytes_hash'], 'global_ordinals')
		),
		field: string,
		max_docs_per_value: optional(integerD(1)),
		missing: optional(string), // [1]
		shard_size: optional(integerD(100)),
	},
	requestDoc: {
		execution_hint: 'The optional execution_hint setting can influence the management of the values used for de-duplication. Each option will hold up to `shard_size` values in memory while performing de-duplication but the type of value held can be controlled as follows: * hold field values directly (`map`) * hold ordinals of the field as determined by the Lucene index (`global_ordinals`) * hold hashes of the field values - with potential for hash collisions (`bytes_hash`)',
		max_docs_per_value: 'The max_docs_per_value is an optional parameter and limits how many documents are permitted per choice of de-duplicating value. The default setting is "1".',
		missing,
		shard_size: 'The shard_size parameter limits how many top-scoring documents are collected in the sample processed on each shard. The default value is 100.'
	},
	tag: 'bucketing',
};

// [1] TODO add constraint to be same type as the field type
