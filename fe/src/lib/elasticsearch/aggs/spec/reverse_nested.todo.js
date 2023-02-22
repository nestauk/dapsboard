import {esSearchableField} from '$lib/elasticsearch/aggs/ref/typeGroups.js';
import {optional} from '$lib/elasticsearch/types/params.js';
import {stringD} from '$lib/types/index.js';

export default {
	id: 'reverse_nested',
	availability: {
		from: '1.3'
	},
	docPath: '/search-aggregations-bucket-reverse-nested-aggregation.html',
	docs: 'A special single bucket aggregation that enables aggregating on parent docs from nested documents. Effectively this aggregation can break out of the nested block structure and link to other nested structures or the root document, which allows nesting other aggregations that aren’t part of the nested object in a nested aggregation.',
	fieldType: esSearchableField,
	label: 'Reverse Nested',
	request: {
		// TODO Check: no `field`, no `missing`
		path: optional(stringD(''))
	},
	requestDoc: {
		path: 'Path of the nested documents within the top level documents.'
	},
	subAggs: true,
	tag: 'bucketing',
};
