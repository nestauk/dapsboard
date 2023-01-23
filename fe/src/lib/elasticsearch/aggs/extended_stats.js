import {esNumeric} from '$lib/elasticsearch/aggs/ref/typeGroups';
import {optional, script} from '$lib/elasticsearch/types/params';
import {floatD, number, string} from '$lib/types';
import {
	field,
	missing,
	script as scriptDoc,
} from '$lib/elasticsearch/aggs/ref/requestDoc';
import response from '$lib/elasticsearch/aggs/response/extendedStats';

export default {
	id: 'extended_stats',
	availability: {
		from: '1.3'
	},
	docPath: '/search-aggregations-metrics-extendedstats-aggregation.html',
	docs: 'Calculates an approximate count of distinct values.',
	label: 'Extended Stats',
	fieldType: esNumeric,
	request: { // [0]
		field: string,
		missing: optional(number),
		script: optional(script),
		sigma: optional(floatD(2)),
	},
	requestDoc: {
		field,
		missing,
		script: scriptDoc,
		sigma: 'Can be any non-negative double which controls how many standard deviations +/- from the mean should be displayed.'
	},
	response,
	tag: 'metric',
	version: '7.9',
};

// [0] 7.9: no params table
