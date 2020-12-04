import {esSearchableField} from 'elasticsearch/aggs/ref/typeGroups';
import {string} from 'types';

export default {
	id: 'nested',
	availability: {
		from: '1.3'
	},
	docPath: '/search-aggregations-bucket-nested-aggregation.html',
	docs: 'A special single bucket aggregation that enables aggregating nested documents.',
	fieldType: esSearchableField,
	label: 'Nested',
	request: {
		// TODO Check: no `field`, no `missing`
		path: string
	},
	requestDoc: {
		path: 'Path of the nested documents within the top level documents.',
	},
	tag: 'bucketing',
};
