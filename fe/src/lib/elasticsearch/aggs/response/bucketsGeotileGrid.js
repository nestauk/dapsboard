import {arrayOf, integer, objectOf} from '$lib/types/index.js';
import {zoomXYString} from '$lib/elasticsearch/types/response.js';

export default {
	id: 'buckets_geotile_grid',
	doc: {
		doc_count: 'The amount of documents in a bucket.',
		key: 'Each cell is labeled using a "{zoom}/{x}/{y}" format, where zoom is equal to the user-specified precision. See https://wiki.openstreetmap.org/wiki/Zoom_levels for zoom levels.',
	},
	shape: {
		buckets: arrayOf(objectOf({
			doc_count: integer,
			key: zoomXYString,
		}))
	},
	tag: 'multi-bucket',
}

/*
{
	"buckets": [
		{
			"doc_count" : 3,
			"key" : "8/131/84"
		},
		{
			"doc_count" : 2,
			"key" : "8/129/88"
		},
		{
			"doc_count" : 1,
			"key" : "8/131/85"
		}
	]
}
*/
