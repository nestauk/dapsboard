import {optional, metricScript} from '$lib/elasticsearch/types/params';
import {any, object} from '$lib/types';
import response from '$lib/elasticsearch/aggs/response/value';

export default {
	id: 'scripted_metric',
	availability: {
		from: '1.4'
	},
	docPath: '/search-aggregations-metrics-scripted-metric-aggregation.html',
	docs: 'A metric aggregation that executes using scripts to provide a metric output.',
	fieldType: any,
	label: 'Scripted Metric',
	request: { // [0]
		combine_script: metricScript,
		init_script: optional(metricScript),
		map_script: metricScript,
		params: optional(object),
		reduce_script: metricScript,
	},
	requestDoc: {
		combine_script: 'Executed once on each shard after document collection is complete. Allows the aggregation to consolidate the state returned from each shard.',
		init_script: 'Executed prior to any collection of documents. Allows the aggregation to set up any initial state.',
		map_script: 'Executed once per document collected.',
		params: 'An object whose contents will be passed as variables to the init_script, map_script and combine_script. This can be useful to allow the user to control the behavior of the aggregation and for storing state between the scripts.',
		reduce_script: 'Executed once on the coordinating node after all shards have returned their results. The script is provided with access to a variable states which is an array of the result of the combine_script on each shard.',
	},
	response,
	tag: 'metric',
	version: '7.9',
};

// [0] 7.9: no params table
