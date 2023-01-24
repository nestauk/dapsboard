import {
	arrayOf,
	integer,
	number,
	objectOf
} from '$lib/types/index.js';

export default {
	id: 'buckets_number',
	doc: {
		key: 'The first value of the bucket extent.',
		doc_count: 'The amount of documents in a bucket.',
	},
	shape: {
		buckets: arrayOf(objectOf({
			doc_count: integer,
			key: number,
		}))
	},
	tag: 'multi-bucket',
}

/*
{
	"buckets": [
		{
			"doc_count": 41431,
			"key": 1985
		},
		{
			"doc_count": 29086,
			"key": 1986
		}
	]
}
*/
