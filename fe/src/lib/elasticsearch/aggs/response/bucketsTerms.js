import {
	arrayOf,
	integer,
	objectOf,
	string,
} from '$lib/types/index.js';

export default {
	id: 'buckets_terms',
	doc: {
		'{bucket}.doc_count': 'The amount of documents in a bucket.',
		'{bucket}.key': 'The bucket term.',
		doc_count_error_upper_bound: 'TODO',
		sum_other_doc_count: 'TODO',
	},
	docLong: {},
	shape: {
		buckets: arrayOf(
			objectOf({
				doc_count: integer,
				key: string,
			})
		),
		doc_count_error_upper_bound: integer,
		sum_other_doc_count: integer,
	},
	tag: 'multi-bucket',
}

/*
{
	"doc_count_error_upper_bound": 5949,
	"sum_other_doc_count": 2704253,
	"buckets": [
		{
			"doc_count": 115416,
			"key": "Humans"
		},
		{
			"doc_count": 77388,
			"key": "Animals"
		},
	]
}
*/
