import {
	arrayOf,
	integer,
	objectOf,
	string
} from '$lib/types';

export default {
	id: 'buckets_geohash_grid',
	doc: {
		doc_count: 'The amount of documents in a bucket.',
		key: 'The hash of a cell.',
	},
	shape: {
		buckets: arrayOf(objectOf({
			doc_count: integer,
			key: string,
		}))
	},
	tag: 'multi-bucket',
}

/*
{
	"buckets": [
		{
			"doc_count": 3,
			"key": "u17"
		},
		{
			"doc_count": 2,
			"key": "u09"
		}
	]
}

High precision geohashes have a long string length and represent cells that cover only a small area.
Low precision geohashes have a short string length and represent cells that each cover a large area.
*/
