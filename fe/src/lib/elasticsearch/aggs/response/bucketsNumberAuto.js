import {
	arrayOf,
	integer,
	number,
	objectOf
} from '$lib/types/index.js';

export default {
	id: 'buckets_number_auto',
	doc: {
		doc_count: 'The amount of documents in a bucket.',
		key: 'The first value of the bucket extent.',
		max: 'The maximum value of the bucket.',
		min: 'The minimum value of the bucket.',
	},
	shape: {
		buckets: arrayOf(objectOf({
			doc_count: integer,
			key: number,
			max: number,
			min: number,
		}))
	},
	tag: 'multi-bucket',
}

/*
{
	"buckets": [
		{
			"doc_count": 2,
			"key": 30.0,
			"max": 50.0,
			"min": 10.0
		},
		{
			"doc_count": 5,
			"key": 185.0,
			"max": 200.0,
			"min": 150.0
		}
	]
}
*/
