import {
	arrayOf,
	integer,
	objectOf,
	recordLike
} from '$lib/types';
import {esNumericButBoolean} from '$lib/elasticsearch/aggs/ref/typeGroups';

export default {
	id: 'top',
	doc: {
		// sort: '? TODO',
		metrics: 'An object where keys are fields and values are numbers or date strings.',
		top: 'The aggregation key.',
	},
	shape: {
		top: arrayOf(
			objectOf({
				sort: arrayOf(integer),
				metrics: recordLike({
					values: esNumericButBoolean
				}),
			})
		)
	},
	tag: 'multi-value',
}


/*
{
	"top": [
		{
			"sort": [3],
			"metrics": {
				"m": 2.718280076980591,
				"i": -12,
				"d": "2019-12-31T00:12:12.000Z"
			}
		},
		{"sort": [3], "metrics": {"m": 2.718280076980591 } },
		{"sort": [2], "metrics": {"m": 1.0 } },
		{"sort": [1], "metrics": {"m": 3.1414999961853027 } }
	]
}

*/
