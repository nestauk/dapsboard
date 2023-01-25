import {integer, number, objectOf} from '$lib/types';

export default {
	id: 'extended_stats',
	doc: {
		avg: 'The average of the value extracted from the documents.',
		count: 'The amount of documents.',
		max: 'The max of all the values extracted from the documents.',
		min: 'The min of all the values extracted from the documents.',
		std_deviation: 'The standard deviation of the values extracted from the documents.',
		std_deviation_bounds: 'The standard deviation bounds.',
		sum_of_squares: 'The sum of the square of the values extracted from the documents.',
		sum: 'The sum of the values extracted from the documents.',
		variance: 'The variance of the values extracted from the documents.',
	},
	docLong: {},
	shape: {
		avg: number,
		count: integer,
		max: number,
		min: number,
		std_deviation: number,
		std_deviation_bounds: objectOf({
			lower: number,
			upper: number
		}),
		sum_of_squares: number,
		sum: number,
		variance: number,
	},
	tag: 'multi-value',
}

/*
{
	"avg": 741707.0497661051,
	"count": 796084,
	"max": 2765946854,
	"min": 1,
	"std_deviation": 4320042.818181389,
	"std_deviation_bounds": {
		"lower": -7898378.586596673,
		"upper": 9381792.686128883
	},
	"sum_of_squares": 15295081725221380000,
	"sum": 590461115006,
	"variance": 18662769950920.6,
}

*/
