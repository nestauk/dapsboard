import {geoPoint} from '$lib/elasticsearch/types/fields.js';
import {optional} from '$lib/elasticsearch/types/params.js';
import {
	arrayOf,
	booleanD,
	enumsOf,
	number,
	objectOf,
	string,
	someOf,
	unionOf,
} from '$lib/types/index.js';
import {field, keyed} from '$lib/elasticsearch/aggs/ref/requestDoc.js';
import response from '$lib/elasticsearch/aggs/response/bucketsRange.js';

export default {
	id: 'geo_distance',
	availability: {
		from: '1.3'
	},
	docPath: '/search-aggregations-bucket-geodistance-aggregation.html',
	docs: 'A multi-bucket aggregation that works on geo_point fields and conceptually works very similar to the range aggregation. The user can define a point of origin and a set of distance range buckets.',
	fieldType: unionOf(geoPoint, arrayOf(geoPoint)),
	label: 'Geo Distance',
	request: { // [0]
		distance_type: enumsOf(['arc', 'plane'], 'arc'),
		field: string,
		keyed: optional(booleanD(false)),
		origin: string,
		ranges: arrayOf(objectOf({
			key: optional(string),
			__extent: someOf({
				from: number,
				to: number,
			}),
		})),
		unit: enumsOf(['m', 'mi', 'in', 'yd', 'km', 'cm', 'mm'], 'm'), // TODO make a type
	},
	requestDoc: {
		distance_type: 'The distance calculation type can be set using the distance_type parameter.',
		field,
		keyed,
		origin: 'The `origin` point can accept all formats supported by the `geo_point` type.',
		ranges: 'Array of objects of shape {from: string, to: string}',
		unit: 'By default, the distance unit is m (meters) but it can also accept: mi (miles), in (inches), yd (yards), km (kilometers), cm (centimeters), mm (millimeters).',
	},
	response,
	tag: 'bucketing',
	version: '7.9',
};

// [0] 7.9: no params table
