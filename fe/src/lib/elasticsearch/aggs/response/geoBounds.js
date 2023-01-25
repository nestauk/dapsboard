import {objectOf} from '$lib/types';
import {geoPointObject} from '$lib/elasticsearch/types/fields';

export default {
	id: 'geo_bounds',
	doc: {
		top_left: 'Top-left coordinate of the bounds.',
		bottom_right: 'Bottom-right coordinate of the bounds.',
	},
	shape: {
		bounds: objectOf({
			bottom_right: geoPointObject,
			top_left: geoPointObject,
		})
	},
	// tag: 'multi-value', ? TODO
}

/*
{
	"bounds": {
		"bottom_right": {
			"lat": 40.715,
			"lon": -73.983
		},
		"top_left": {
			"lat": 40.722,
			"lon": -74.011
		}
	}
}
*/
