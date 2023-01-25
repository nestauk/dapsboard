import {integer, number} from '$lib/types/index.js';

export default {
	id: 'stats',
	doc: {
		avg: 'The average of the value extracted from the documents.',
		count: 'The amount of documents.',
		max: 'The max of all the values extracted from the documents.',
		min: 'The min of all the values extracted from the documents.',
		sum: 'The sum of the values extracted from the documents.',
	},
	docLong: {},
	shape: {
		avg: number,
		count: integer,
		max: number,
		min: number,
		sum: number,
	},
	tag: 'multi-value',
}

/*
{
	"avg": 741707.0497661051,
	"count": 796084,
	"max": 2765946854,
	"min": 1,
	"sum": 590461115006
}
*/
