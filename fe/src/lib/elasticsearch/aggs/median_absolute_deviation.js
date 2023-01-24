import {optional, script} from 'elasticsearch/types/params';
import {
	integerD,
	string,
	number
} from 'types';
import {
	field,
	missing,
	script as scriptDoc,
} from 'elasticsearch/aggs/ref/requestDoc';
import response from 'elasticsearch/aggs/response/value';

export default {
	id: 'median_absolute_deviation',
	availability: {
		from: '6.6'
	},
	docPath: '/search-aggregations-metrics-median-absolute-deviation-aggregation.html',
	docs: ' Median absolute deviation is a measure of variability. It is a robust statistic, meaning that it is useful for describing data that may have outliers, or may not be normally distributed. For such data it can be more descriptive than standard deviation.',
	fieldType: number,
	label: 'Median Absolute Deviation',
	request: { // [0]
		compression: optional(integerD(100)),
		field: string,
		missing: optional(number),
		script: optional(script),
	},
	requestDoc: {
		field,
		compression: 'The tradeoff between resource usage and accuracy of a TDigest’s quantile approximation, and therefore the accuracy of this aggregation’s approximation of median absolute deviation, is controlled by the compression parameter.',
		missing,
		script: scriptDoc,
	},
	response,
	tag: 'metric',
	version: '7.9',
};

// [0] 7.9: no params table
