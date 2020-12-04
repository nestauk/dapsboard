import {geoBounds, geoPointObject} from 'elasticsearch/types/fields';
import {optional} from 'elasticsearch/types/params';
import {
	integer,
	integerD,
	intWithin,
	string
} from 'types';
import {field} from 'elasticsearch/aggs/ref/requestDoc';
import response from 'elasticsearch/aggs/response/bucketsGeohashGrid';

export default {
	id: 'geohash_grid',
	availability: {
		from: '1.3'
	},
	docPath: '/search-aggregations-bucket-geohashgrid-aggregation.html',
	docs: 'A multi-bucket aggregation that works on `geo_point` fields and groups points into buckets that represent cells in a grid. The resulting grid can be sparse and only contains cells that have matching data.',
	fieldType: geoPointObject,
	label: 'Geohash Grid',
	request: { // [1]
		field: string,
		bounds: optional(geoBounds),
		precision: optional(intWithin([0, 12], 5)),
		shard_size: optional(integer), // [2]
		size: optional(integerD(10000)),
	},
	requestDoc: {
		field,
		bounds: 'The bounding box to filter the points in the bucket.',
		precision: 'The string length of the geohashes used to define cells/buckets in the results. Defaults to 5.',
		shard_size: 'To allow for more accurate counting of the top cells returned in the final result the aggregation defaults to returning max(10,(size x number-of-shards)) buckets from each shard. If this heuristic is undesirable, the number considered from each shard can be over-ridden using this parameter.',
		size: 'The maximum number of geohash buckets to return (defaults to 10,000).',
	},
	response,
	tag: 'bucketing',
	version: '7.9',
};

// [1] params table: https://www.elastic.co/guide/en/elasticsearch/reference/7.10/search-aggregations-bucket-geohashgrid-aggregation.html#_options_3
// [2] ES default is -> max(10,(size x number-of-shards)) buckets from each shard.
