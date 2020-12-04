import {
	arrayOf,
	enumsOf,
	float,
	integer,
	object,
	objectOf,
	unionOf,
} from 'types';

export default {
	id: 'hits',
	doc: {
		'hits.total.value': 'The amount of selected top documents in a certain bucket.', // inferred, TBD
		'hits.total.relation': 'TODO.',
		'hits.max_score': 'The max score among the selected top documents', // inferred, TBD
		'hits.hits': 'The array of selected top documents',
	},
	docLong: {},
	shape: {
		hits: objectOf({
			total: objectOf({
				value: integer,
				relation: enumsOf(['eq'])
			}),
			max_score: unionOf(float, null),
			hits: arrayOf(object) // array of documents
		})
	},
	tag: 'sub-aggregator', // you don't use it to get a value
}

/*
{
	"hits": {
		"total": {
			"relation": "eq",
			"value": 3
		},
		"max_score": null,
		"hits": [
			{
				"_index": "sales",
				"_type": "_doc",
				"_id": "AVnNBmauCQpcRyxw6ChK",
				"_source": {
					"date": "2015/03/01 00:00:00",
					"price": 200
				},
				"sort": [
					1425168000000
				],
				"_score": null
			}
		]
	}
}

*/
