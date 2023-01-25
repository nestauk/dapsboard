import {arrayOf, integer, objectOf} from '$lib/types/index.js';
import {esDates} from '$lib/elasticsearch/aggs/ref/typeGroups.js';

export default {
	id: 'buckets_date',
	doc: {
		key_as_string: 'The date as string (e.g. `1986-01-01T00:00:00.000Z`).',
		key: 'The date as timestamp (e.g. 504921600000).',
		doc_count: 'The amount of documents in a bucket.',
	},
	shape: {
		buckets: arrayOf(objectOf({
			doc_count: integer,
			key_as_string: esDates,
			key: integer,
		}))
	},
	tag: 'multi-bucket',
	version: '7.9',
}

/*
{
	"buckets": [
		{
			"doc_count": 1,
			"key_as_string": "1986-01-01T00:00:00.000Z",
			"key": 504921600000
		},
		{
			"doc_count": 0,
			"key_as_string": "1987-01-01T00:00:00.000Z",
			"key": 536457600000
		},
		{
			"doc_count": 1,
			"key_as_string": "1988-01-01T00:00:00.000Z",
			"key": 567993600000
		}
	]
}
*/
