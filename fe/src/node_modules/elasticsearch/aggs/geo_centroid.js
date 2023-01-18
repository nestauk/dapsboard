import {geoPointObject} from 'elasticsearch/types/fields';
import {string} from 'types';
import {field} from 'elasticsearch/aggs/ref/requestDoc';
import response from 'elasticsearch/aggs/response/geoCentroid';

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
