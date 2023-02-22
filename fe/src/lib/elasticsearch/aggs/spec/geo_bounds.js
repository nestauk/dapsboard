import {
	geoPointObject,
	geoPointString
} from '$lib/elasticsearch/types/fields.js';
import {optional} from '$lib/elasticsearch/types/params.js';
import {booleanD, string} from '$lib/types/index.js';
import {field, missing} from '$lib/elasticsearch/aggs/ref/requestDoc.js';
import response from '$lib/elasticsearch/aggs/response/geoBounds.js';

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
