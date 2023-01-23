import {esSearchableField} from 'elasticsearch/aggs/ref/typeGroups';
import {optional, sortOrder} from 'elasticsearch/types/params';
import {
	arrayOf,
	integerD,
	objectOf,
	recordLike,
	string,
	unionOf
} from 'types';
import response from 'elasticsearch/aggs/response/hits';

export default {
	id: 'top_hits',
	availability: {
		from: '1.3'
	},
	docPath: '/search-aggregations-metrics-top-hits-aggregation.html',
	docs: 'Keeps track of the most relevant document being aggregated. This aggregator is intended to be used as a sub aggregator, so that the top matching documents can be aggregated per bucket.',
	fieldType: esSearchableField, // TBD
	label: 'Top Hits',
	needsParent: true,
	request: { // [0]
		_source: optional(objectOf({
			includes: unionOf(string, arrayOf(string))
		})),
		from: optional(integerD(0, true)),
		size: optional(integerD(3)),
		sort: optional(arrayOf(recordLike({
			values: objectOf({
				order: sortOrder
			})
		}))),
	},
	requestDoc: {
		_source: 'If _source is requested then just the part of the source of the nested object is returned, not the entire source of the document.',
		from: 'The offset from the first result you want to fetch.',
		size: 'The maximum number of top matching hits to return per bucket. By default the top three matching hits are returned.',
		sort: 'How the top matching hits should be sorted. By default the hits are sorted by the score of the main query.',
	},
	response,
	tag: 'metric',
	version: '7.9',
};

// [0] 7.9: no params table
