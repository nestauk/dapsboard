import {
	// calendarIntervals,
	// calendarIntervalsFromMonth,
	optional,
	// rateIntervalsFromMonth,
	// rateIntervalsToWeek,
	script,
} from 'elasticsearch/types/params';
import {number, string} from 'types';
import {field, script as scriptDoc} from 'elasticsearch/aggs/ref/requestDoc';
import response from 'elasticsearch/aggs/response/value';

export default {
	id: 'rate',
	fieldType: number,
	availability: {
		from: '7.10'
	},
	constraints: {
		parentAggs: ['date_histogram'],
	},
	docPath: '/search-aggregations-metrics-rate-aggregation.html',
	docs: 'A rate metrics aggregation can be used only inside a date_histogram and calculates a rate of documents or a field in each date_histogram bucket..',
	label: 'Rate',
	request: { // [0]
		field: optional(string),
		script: optional(script),
		unit: optional(string),
		// __constraints: {
		// 	date_histogram: [
		// 		[
		// 			{calendar_interval: calendarIntervals},
		// 			{unit: rateIntervalsToWeek}
		// 		],
		// 		[
		// 			{calendar_interval: calendarIntervalsFromMonth},
		// 			{unit: rateIntervalsFromMonth}
		// 		],
		// 	]
		// }
	},
	requestDoc: {
		field,
		script: scriptDoc,
		unit: 'The size of the rate (annual, monthly, etc).',
	},
	response,
	tag: 'metric',
	version: '7.9',
};

// [0] 7.10: no params table
