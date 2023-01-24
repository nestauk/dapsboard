import {esNumeric} from '$lib/elasticsearch/aggs/ref/typeGroups.js';
import {
	fieldObjectOf,
	optional,
	sortOrder
} from '$lib/elasticsearch/types/params.js';
import {geoPointString} from '$lib/elasticsearch/types/fields.js';
import {
	arrayOf,
	enumsOf,
	integerD,
	objectOf,
	string,
	unionOf
} from '$lib/types/index.js';
import response from '$lib/elasticsearch/aggs/response/topMetrics.js';

export default {
	id: 'top_metrics',
	availability: {
		from: '7.7'
	},
	docPath: '/search-aggregations-metrics-top-metrics.html',
	docs: 'Selects metrics from the document with the largest or smallest "sort" value.',
	fieldType: esNumeric,
	label: 'Top Metrics',
	needsParent: false,
	request: { // [0]
		metrics: unionOf(
			fieldObjectOf(string),
			arrayOf(fieldObjectOf(string))
		),
		size: optional(integerD(1)),
		sort: unionOf(
			fieldObjectOf(sortOrder),
			fieldObjectOf(objectOf({
				order: sortOrder,
				numeric_type: string // [1]
			})),
			objectOf({
				_geo_distance: objectOf({
					location: geoPointString
				}),
			}),
			enumsOf(['_score']),
		),
	},
	requestDoc: {
		metric: 'Selects the fields of the "top" document to return. You can request a single metric with something like "metric": {"field": "m"} or multiple metrics by requesting a list of metrics like "metric": [{"field": "m"}, {"field": "i"}.',
		size: 'The maximum number of top matching hits to return per bucket. By default the top three matching hits are returned.',
		sort: 'Allows you to add one or more sorts on specific fields. Each sort can be reversed as well. The sort is defined on a per field level, with special field name for _score to sort by score, and _doc to sort by index order.',
	},
	response,
	tag: 'metric',
	version: '7.9',
};

/*
[0] 7.9: no params table
[1] could be more specific as a unionOf numbes types (['double', ...])
see https://www.elastic.co/guide/en/elasticsearch/reference/7.9/search-aggregations-metrics-top-metrics.html
*/
