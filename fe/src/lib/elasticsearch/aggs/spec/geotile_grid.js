import {geoBounds, geoPointObject} from '$lib/elasticsearch/types/fields.js';
import {optional} from '$lib/elasticsearch/types/params.js';
import {
	integer,
	integerD,
	intWithin,
	string,
} from '$lib/types/index.js';
import {field} from '$lib/elasticsearch/aggs/ref/requestDoc.js';
import response from '$lib/elasticsearch/aggs/response/bucketsGeotileGrid.js';

export default {
	id: 'geotile_grid',
	availability: {
		from: '7.0'
	},
	docPath: '/search-aggregations-bucket-geotilegrid-aggregation.html',
	docs: 'A multi-bucket aggregation that works on `geo_point` fields and groups points into buckets that represent cells in a grid. The resulting grid can be sparse and only contains cells that have matching data. Each cell corresponds to a map tile as used by many online map sites. Each cell is labeled using a "{zoom}/{x}/{y}" format, where zoom is equal to the user-specified precision.',
	fieldType: geoPointObject,
	label: 'Geotile Grid',
	request: { // [1]
		field: string,
		bounds: optional(geoBounds),
		precision: optional(intWithin([0, 29], 7)), // [2]
		shard_size: optional(integer), // defaults to `max(10,(size x number-of-shards))`
		size: optional(integerD(10000)),
	},
	requestDoc: {
		field,
		bounds: 'The bounding box to filter the points in the bucket.',
		precision: 'The integer zoom of the key used to define cells/buckets in the results. Defaults to 7. Values outside of [0,29] will be rejected.',
		shard_size: 'To allow for more accurate counting of the top cells returned in the final result the aggregation defaults to returning max(10,(size x number-of-shards)) buckets from each shard. If this heuristic is undesirable, the number considered from each shard can be over-ridden using this parameter.',
		size: 'The maximum number of geohash buckets to return (defaults to 10,000). When results are trimmed, buckets are prioritised based on the volumes of documents they contain.',
	},
	response,
	subAggs: true,
	tag: 'bucketing',
	version: '7.9',
};

/*
Implementation
When requesting detailed buckets (typically for displaying a "zoomed in" map) a filter like `geo_bounding_box` should be applied to narrow the subject area otherwise potentially millions of buckets will be created and returned.

[1] params table: https://www.elastic.co/guide/en/elasticsearch/reference/7.10/search-aggregations-bucket-geotilegrid-aggregation.html#_options_4
*/
