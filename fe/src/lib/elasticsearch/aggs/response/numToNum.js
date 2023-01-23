import {
	arrayOf,
	number,
	numString,
	recordLike,
	unionOf
} from '$lib/types';

export default {
	id: 'numkeyToNum',
	doc: {
		keys: 'Stringified numbers. E.g. percentiles thresholds.',
		values: 'Numbers. E.g. for percentiles, each number is the value at which N percent of the data (the numeric key) is below it.',
		key: 'The datapoint key.',
		value: 'The datapoint value.',
	},
	shape: {
		values: unionOf(
			recordLike({
				keys: numString,
				values: number,
			}),
			arrayOf({
				key: number,
				value: number,
			})
		)
	},
	tag: 'multi-value',
}

/*
{
	"values": {
		"1.0": 5999.9276611275045,
		"5.0": 23167.228213570834
	}
}

{
	"values": [
		{
			"key": 1.0,
			"value": 5.0
		},
		{
			"key": 5.0,
			"value": 25.0
		}
	]
}
*/
