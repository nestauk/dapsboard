import {optional} from 'elasticsearch/types/params';
import {integerD, number, string} from 'types';
import {field} from 'elasticsearch/aggs/ref/requestDoc';
import response from 'elasticsearch/aggs/response/bucketsDocCount';

export default {
	id: 'variable_width_histogram',
	availability: {
		from: '7.9'
	},
	docPath: '/search-aggregations-bucket-variablewidthhistogram-aggregation.html',
	docs: 'This is a multi-bucket aggregation similar to Histogram. However, the width of each bucket is not specified. Rather, a target number of buckets is provided and bucket intervals are dynamically determined based on the document distribution. Unlike other multi-bucket aggregations, the intervals will not necessarily have a uniform width.',
	fieldType: number,
	label: 'Auto Histogram',
	request: { // [0] 7.9: no params table
		buckets: optional(integerD(10)),
		field: string,
		initial_buffer: optional(integerD(5000)),
		shard_size: optional(integerD(500)),
	},
	requestDoc: {
		buckets: 'The target number of buckets. Bucket intervals are dynamically determined based on the document distribution.',
		field,
		initial_buffer: 'The number of individual documents that will be stored in memory on a shard before the initial bucketing algorithm is run. Bucket distribution is determined using this sample of initial_buffer documents. So, although a higher initial_buffer will use more memory, it will lead to more representative clusters.',
		shard_size: 'The number of buckets that the coordinating node will request from each shard.',
	},
	response,
	tag: 'bucketing',
	lastChecked: '7.9',
};

/*
[0] 7.9: no params table
[1] TODO later (#201): needs a constraint
> This aggregation cannot currently be nested under any aggregation that collects from more than a single bucket.
https://www.elastic.co/guide/en/elasticsearch/reference/7.9/search-aggregations-bucket-variablewidthhistogram-aggregation.html
*/
