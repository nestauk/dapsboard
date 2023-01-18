import {optional} from 'elasticsearch/types/params';
import {
	arrayOf,
	integer,
	string,
	number,
	objectOf,
} from 'types';

export default {
	id: 'buckets_date_range',
	doc: {
		doc_count: 'The amount of documents in a bucket.',
		from_as_string: 'Start of the range (included) - as a string.',
		from: 'Start of the range (included).',
		key: 'The range key (e.g. `*-100.0`, `100.0-200.0`, `200.0-*`, or custom if ranges are named`).',
		to_as_string: 'End of the range (excluded) - as a string.',
		to: 'End of the range (excluded).',
	},
	shape: {
		buckets: arrayOf(
			objectOf({
				doc_count: integer,
				from_as_string: optional(string),
				from: optional(number),
				key: string,
				to_as_string: optional(string),
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
			"doc_count": 7,
			"key": "*-10-2015",
			"to_as_string": "10-2015",
			"to": 1.4436576E12
		},
		{
			"doc_count": 0,
			"from_as_string": "10-2015",
			"from": 1.4436576E12,
			"key": "10-2015-*"
		}
	]
}
*/
