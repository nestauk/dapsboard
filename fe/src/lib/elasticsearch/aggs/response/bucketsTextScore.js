import {
	arrayOf,
	integer,
	number,
	objectOf,
	string,
} from '$lib/types';

export default {
	id: 'buckets_text_score',
	doc: {
		'{bucket}.bg_count': 'TODO.',
		'{bucket}.doc_count': 'The amount of documents in a bucket.',
		'{bucket}.key': 'The bucket term.',
		'{bucket}.score': 'The bucket score.',
		bg_count: 'TODO',
		doc_count: 'The amount of documents in a bucket.',
	},
	shape: {
		bg_count: integer,
		buckets: arrayOf(
			objectOf({
				bg_count: integer,
				doc_count: integer,
				key: string,
				score: number,
			})
		),
		doc_count: integer,
	},
	tag: 'multi-bucket',
}

/*
{
	"bg_count": 4814301,
	"buckets": [
		{
			"bg_count": 751990,
			"doc_count": 503375,
			"key": "North America",
			"score": 0.7828902342051492
		},
		{
			"bg_count": 1926,
			"doc_count": 1247,
			"key": "Europe",
			"score": 0.0018404593616494103
		}
	],
	"doc_count": 1153445
}

*/
