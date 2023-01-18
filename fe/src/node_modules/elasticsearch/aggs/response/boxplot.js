import {integer, float, number} from 'types';

export default {
	id: 'boxplot',
	doc: {
		count: 'The number of non-empty fields counted.',
		max: 'The largest data point excluding any outliers.',
		min: 'The lowest data point excluding any outliers.',
		q1: 'Also known as the lower quartile qn(0.25), is the median of the lower half of the dataset.',
		q2: 'The middle value of the dataset.',
		q3: 'Also known as the upper quartile qn(0.75), is the median of the upper half of the dataset.',
	},
	shape: {
		count: integer,
		max: number,
		min: number,
		q1: float,
		q2: float,
		q3: float,
	},
	tag: 'multi-value',
}

/*
{
	"max": 990.0,
	"min": 0.0,
	"q1": 165.0,
	"q2": 445.0,
	"q3": 725.0
}
*/
