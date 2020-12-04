import {esDates} from 'elasticsearch/aggs/ref/typeGroups';
import {dateMathString, optional} from 'elasticsearch/types/params';
import {
	arrayOf,
	booleanD,
	objectOf,
	someOf,
	string,
	stringD,
	unionOf,
} from 'types';
import {field, keyed, missing} from 'elasticsearch/aggs/ref/requestDoc';
import response from 'elasticsearch/aggs/response/bucketsDateRange';

export default {
	id: 'date_range',
	availability: {
		from: '1.3'
	},
	docPath: '/search-aggregations-bucket-daterange-aggregation.html',
	docs: 'A range aggregation that is dedicated for date values. The main difference between this aggregation and the normal range aggregation is that the from and to values can be expressed in Date Math expressions, and it is also possible to specify a date format by which the from and to response fields will be returned.',
	fieldType: esDates,
	label: 'Date Range',
	request: { // [0]
		field: string,
		format: stringD('YYYYMMdd', true),
		keyed: optional(booleanD(false)),
		missing: optional(string), // [1]
		ranges: arrayOf(objectOf({
			key: optional(string),
			__extent: someOf({
				from: unionOf(string, dateMathString),
				to: unionOf(string, dateMathString),
			}),
		})),
		time_zone: optional(string),
	},
	requestDoc: {
		field,
		format: 'Date Format/Pattern',
		keyed,
		missing,
		ranges: 'Array of objects of shape {from: string, to: string} where the strings represent dates.',
		time_zone: 'Dates can be converted from another time zone to UTC by specifying an ISO 8601 UTC offset (e.g. +01:00 or -08:00) or as one of the time zone ids from the TZ database (e.g. `CET`).', // [1]
	},
	response,
	tag: 'bucketing',
	version: '7.9',
};

// [0] 7.9: no params table
// [1] TODO later on: could be unionOf(number, string) or `dateString` which would be a string input that accepts strings that can be parsed as dates, including timestamps
