import {optional} from 'elasticsearch/types/params';
import {number} from 'types';

export default {
	id: 'value',
	doc: {
		value: 'The output value.',
		value_as_string: 'The stringified value (e.g. available for `esNumeric` types that can be converted to numbers, like dates).',
	},
	docLong: {},
	shape: {
		value_as_string: optional(number),
		value: number,
	},
	tag: 'single-value',
}

/*
{
	"value": 741707.0497661051
}

{
	"value" : 1826248545820800000
	"value_as_string" : "57873482-08-14"
}
*/
