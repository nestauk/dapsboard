import {esDates} from 'elasticsearch/aggs/ref/typeGroups';
import {
	optional,
	genericInterval,
	calendarInterval,
	fixedInterval,
	sortOptions,
} from 'elasticsearch/types/params';
import {
	booleanD,
	extentOf,
	integerD,
	string,
	stringD,
	xorOf,
} from 'types';
import {
	field,
	keyed,
	min_doc_count,
	missing
} from 'elasticsearch/aggs/ref/requestDoc';
import response from 'elasticsearch/aggs/response/bucketsDate';

export default {
	id: 'date_histogram',
	availability: {
		from: '1.3'
	},
	docPath: '/search-aggregations-bucket-datehistogram-aggregation.html',
	docs: 'This multi-bucket aggregation is similar to the normal histogram, but it can only be used with date values. Because dates are represented internally in Elasticsearch as long values, it is possible, but not as accurate, to use the normal histogram on dates as well.',
	fieldType: esDates,
	label: 'Date Histogram',
	request: { // [0]
		__intervals: xorOf({
			interval: genericInterval,
			calendar_interval: calendarInterval,
			fixed_interval: fixedInterval
		}),
		extended_bounds: optional(extentOf(esDates)),
		field: string,
		format: optional(string), // [1]
		keyed: optional(booleanD(false)),
		min_doc_count: optional(integerD(1, true)),
		missing: optional(string), // [4]
		offset: optional(string), // [2]
		order: optional(sortOptions),
		time_zone: stringD('UTC'),
		// [3]
	},
	requestDoc: {
		__interval: 'Select among `interval` for ES < 7 datasets and `calendar_interval` and `fixed_interval` for ES >= 7.',
		extended_bounds: 'With extended_bounds setting, you now can "force" the histogram aggregation to start building buckets on a specific min value and also keep on building buckets up to a max value (even if there are no documents anymore). Using extended_bounds only makes sense when `min_doc_count` is 0 (the empty buckets will never be returned if `min_doc_count` is greater than 0).',
		field,
		format: 'Date format pattern specification.',
		keyed,
		min_doc_count,
		missing,
		offset: 'Changes the start value of each bucket by the specified positive (+) or negative offset (-) duration, such as `1h` for an hour, or `1d` for a day. See `Time units` for more possible time duration options.',
		order: 'The order of the buckets can be customized by setting the order parameter.',
		time_zone: 'Use the time_zone parameter to indicate that bucketing should use a different time zone.',
	},
	response,
	tag: 'bucketing',
	version: '7.9',
};

// [0] 7.9: no params table
// [1] TODO probably need a DateTimeFormatter type, see /search-aggregations-bucket-daterange-aggregation.html#date-format-pattern
// [2] TODO probably need a timeUnits type, https://www.elastic.co/guide/en/elasticsearch/reference/7.9/common-options.html#time-units
// [3] TODO later on: supports scripting, https://www.elastic.co/guide/en/elasticsearch/reference/7.9/search-aggregations-bucket-datehistogram-aggregation.html#_using_a_script_to_aggregate_by_day_of_the_week
// [4] TODO later on: could be unionOf(number, string) or `dateString` which would be a string input that accepts strings that can be parsed as dates, including timestamps
