import {geoPointObject} from '$lib/elasticsearch/types/fields.js';
import {string} from '$lib/types/index.js';
import {field} from '$lib/elasticsearch/aggs/ref/requestDoc.js';
import response from '$lib/elasticsearch/aggs/response/geoCentroid.js';

export default {
	id: 'geo_centroid',
	availability: {
		from: '2.1'
	},
	docPath: '/search-aggregations-metrics-geocentroid-aggregation.html',
	docs: 'Computes the weighted centroid from all coordinate values for geo fields.',
	fieldType: geoPointObject,
	label: 'Geo Centroid',
	request: { // [0]
		field: string,
	},
	requestDoc: {
		field,
	},
	response,
	tag: 'metric',
	version: '7.9',
};

// [0] 7.9: no params table
