import {optional} from 'elasticsearch/types/params';
import {
	integer,
	float,
	recordLike
} from 'types';

export default {
	id: 'string_stats',
	doc: {
		count: 'The number of non-empty fields counted.',
		min_length: 'The length of the shortest term.',
		max_length: 'The length of the longest term.',
		avg_length: 'The average length computed over all terms.',
		entropy: 'The Shannon Entropy value computed over all terms collected by the aggregation. Shannon entropy quantifies the amount of information contained in the field. It is a very useful metric for measuring a wide range of properties of a data set, such as diversity, similarity, randomness etc.'
	},
	shape: {
		count: integer,
		min_length: integer,
		max_length: integer,
		avg_length: float,
		entropy: float,
		distribution: optional(recordLike({
			values: float
		}))
	},
	tag: 'multi-value',
}
