import {optional} from 'elasticsearch/types/params';
import {
	arrayOf,
	integer,
	string,
	number,
	objectOf,
} from 'types';

export default {
	id: 'buckets_range',
	doc: {
		doc_count: 'The amount of documents in a bucket.',
		from: 'Start of the range (included).',
		key: 'The range key (e.g. `*-100.0`, `100.0-200.0`, `200.0-*`, or custom if ranges are named`).',
		to: 'End of the range (excluded).',
	},
	shape: {
		buckets: arrayOf(
			objectOf({
				doc_count: integer,
				from: optional(number),
				key: string,
				to: optional(number),
			})
		)
	},
	tag: 'multi-bucket',
}

/*
{
	"buckets": [
		{
			"doc_count": 2,
			"key": "*-100.0",
			"to": 100.0
		},
		{
			"doc_count": 2,
			"from": 100.0,
			"key": "100.0-200.0",
			"to": 200.0
		},
		{
			"doc_count": 3,
			"from": 200.0,
			"key": "200.0-*"
		}
	]
}
*/
