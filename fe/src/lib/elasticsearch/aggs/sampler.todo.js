import {esSearchableField} from '$lib/elasticsearch/aggs/ref/typeGroups';
import {optional} from '$lib/elasticsearch/types/params';
import {integerD} from '$lib/types';

export default {
	id: 'sampler',
	availability: {
		from: '2.0'
	},
	docPath: '/search-aggregations-bucket-sampler-aggregation.html',
	docs: 'A filtering aggregation used to limit any sub aggregations processing to a sample of the top-scoring documents.',
	fieldType: esSearchableField,
	label: 'Sampler',
	request: {
		shard_size: optional(integerD(100))
	},
	requestDoc: {
		shard_size: 'The shard_size parameter limits how many top-scoring documents are collected in the sample processed on each shard. The default value is 100.'
	},
	tag: 'bucketing',
};
