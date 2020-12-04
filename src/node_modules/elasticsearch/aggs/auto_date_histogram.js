import {esDates} from 'elasticsearch/aggs/ref/typeGroups';
import {optional} from 'elasticsearch/types/params';
import {
	integer,
	integerD,
	string,
	stringD,
} from 'types';
import {field, missing} from 'elasticsearch/aggs/ref/requestDoc';
import response from 'elasticsearch/aggs/response/bucketsDate';

export default {
	id: 'auto_date_histogram',
	availability: {
		from: '6.5'
	},
	docPath: '/search-aggregations-bucket-autodatehistogram-aggregation.html',
	docs: 'A multi-bucket aggregation similar to the Date histogram aggregation except instead of providing an interval to use as the width of each bucket, a target number of buckets is provided indicating the number of buckets needed and the interval of the buckets is automatically chosen to best achieve that target. The number of buckets returned will always be less than or equal to this target number.',
	fieldType: esDates,
	label: 'Auto Date Histogram',
	request: { // [0]
		buckets: optional(integerD(10)),
		field: string,
		format: optional(stringD('YYYYMMdd', true)),
		minimum_inteval: optional(integer),
		missing: optional(string), // [2]
		time_zone: optional(stringD('UTC')),
		// [1]
	},
	requestDoc: {
		buckets: 'The buckets field is optional, and will default to 10 buckets if not specified.',
		field,
		format: 'Date format pattern specification.',
		minimum_inteval: 'The minimum_interval allows the caller to specify the minimum rounding interval that should be used. This can make the collection process more efficient, as the aggregation will not attempt to round at any interval lower than minimum_interval.',
		missing,
		time_zone: 'The time_zone parameter can be used to indicate that bucketing should use a different time zone.',
	},
	response,
	tag: 'bucketing',
	version: '7.9',
};

// [0] 7.10: no params table
// [1] TODO later on: supports scripting
// [2] TODO later on: could be unionOf(number, string) or `dateString` which would be a string input that accepts strings that can be parsed as dates, including timestamps
