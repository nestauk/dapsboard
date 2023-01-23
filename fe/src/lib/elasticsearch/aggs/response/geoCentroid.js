import {integer, objectOf} from '$lib/types';
import {latitude, longitude} from '$lib/elasticsearch/types/fields';

export default {
	id: 'geo_centroid',
	doc: {
		'location.lat': 'The centroid latitude.',
		'location.lon': 'The centroid longitude.',
		count: 'The amount of documents used to compute the centroid.',
	},
	shape: {
		location: objectOf({
			lat: latitude,
			lon: longitude,
		}),
		count: integer
	},
	tag: 'multi-value',
}

/*
{
	"location": {
		"lat": 35.873757200922626,
		"lon": -35.96746732692259
	},
	"count": 545302
}
*/
