import {esSearchableField} from 'elasticsearch/aggs/ref/typeGroups';
import {string} from 'types';
import {field} from 'elasticsearch/aggs/ref/requestDoc';
import response from 'elasticsearch/aggs/response/docCount';

export default {
	id: 'missing',
	availability: {
		from: '1.3'
	},
	docPath: '/search-aggregations-bucket-missing-aggregation.html',
	docs: 'A field data based single bucket aggregation, that creates a bucket of all documents in the current document set context that are missing a field value (effectively, missing a field or having the configured NULL value set).',
	fieldType: esSearchableField,
	label: 'Missing',
	request: {// [0]
		field: string,
	},
	requestDoc: {
		field,
	},
	response,
	tag: 'bucketing',
	version: '7.9',
};

// [0] 7.9: no params table
