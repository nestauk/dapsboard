import {
	geoPointObject,
	geoPointString
} from 'elasticsearch/types/fields';
import {optional} from 'elasticsearch/types/params';
import {booleanD, string} from 'types';
import {field, missing} from 'elasticsearch/aggs/ref/requestDoc';
import response from 'elasticsearch/aggs/response/geoBounds';

export default {
	id: 'geo_bounds',
	availability: {
		from: '1.3'
	},
	docPath: '/search-aggregations-metrics-geobounds-aggregation.html',
	docs: 'Computes the bounding box containing all geo values for a field.',
	fieldType: geoPointObject,
	label: 'Geo Bounds',
	request: {
		field: string,
		missing: optional(geoPointString),
		wrap_longitude: optional(booleanD(true)),
	},
	requestDoc: {
		field,
		missing,
		wrap_longitude: 'Specifies whether the bounding box should be allowed to overlap the international date line.',
	},
	response,
	tag: 'metric',
	version: '7.9',
};
