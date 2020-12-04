const metricFieldDocs = {
	missing: 'A value to use if the field is missing entirely',
};

export default {
	avg: {
		__docs: 'Computes the average of numeric values that are extracted from the aggregated documents.',
		...metricFieldDocs,
		script: 'Scripting supports parameterized input.',
	},
	boxplot: {
		__docs: 'Computes boxplot of numeric values extracted from the aggregated documents. ',
		...metricFieldDocs,
		compression: 'Approximate algorithms must balance memory utilization with estimation accuracy. This balance can be controlled using a compression parameter.',
		script: 'Scripting supports parameterized input.',
	},
	cardinality: {
		__docs: 'Calculates an approximate count of distinct values.',
		...metricFieldDocs,
		precision_threshold: 'Allows to trade memory for accuracy, and defines a unique count below which counts are expected to be close to accurate. Above this value, counts might become a bit more fuzzy. The maximum supported value is 40000, thresholds above this number will have the same effect as a threshold of 40000. The default value is 3000.',
		script: 'Scripting supports parameterized input.',
	},
	extended_stats: {
		__docs: 'Calculates an approximate count of distinct values.',
		...metricFieldDocs,
		sigma: 'sigma can be any non-negative double which controls how many standard deviations +/- from the mean should be displayed.',
		script: 'Scripting supports parameterized input.',
	},
	geo_bounds: {
		__docs: 'Computes the bounding box containing all geo values for a field.',
		...metricFieldDocs,
		wrap_longitude: 'Specifies whether the bounding box should be allowed to overlap the international date line.'
	},
	geo_centroid: {
		__docs: 'Computes the weighted centroid from all coordinate values for geo fields.',
		...metricFieldDocs
	},
	max: {
		__docs: 'Returns the maximum value among the numeric values extracted from the aggregated documents.',
		...metricFieldDocs,
		script: 'Scripting supports parameterized input.',
	},
	median_absolute_deviation: {
		__docs: ' Median absolute deviation is a measure of variability. It is a robust statistic, meaning that it is useful for describing data that may have outliers, or may not be normally distributed. For such data it can be more descriptive than standard deviation.',
		...metricFieldDocs,
		compression: 'The tradeoff between resource usage and accuracy of a TDigest’s quantile approximation, and therefore the accuracy of this aggregation’s approximation of median absolute deviation, is controlled by the compression parameter.',
		script: 'Scripting supports parameterized input.',
	},
	min: {
		__docs: 'Returns the minimum value among numeric values extracted from the aggregated documents.',
		...metricFieldDocs,
		script: 'Scripting supports parameterized input.',
	},
	percentile_ranks: {
		__docs: 'Calculates one or more percentile ranks over numeric values extracted from the aggregated documents.',
		...metricFieldDocs,
		values: 'List of treshold values to use for ranking.',
		keyed: 'By default, the buckets are returned as an ordered array. It is also possible to request the response as a hash instead keyed by the buckets keys.',
		hdr: '(High Dynamic Range Histogram) is an alternative implementation that can be useful when calculating percentile ranks for latency measurements as it can be faster than the t-digest implementation with the trade-off of a larger memory footprint.',
		script: 'Scripting supports parameterized input.',
	},
	percentiles: {
		__docs: 'Calculates one or more percentiles over numeric values extracted from the aggregated documents. ',
		...metricFieldDocs,
		percents: 'List of treshold values to use for ranking.',
		keyed: 'Setting the keyed flag to true will associate a unique string key with each bucket and return the ranges as a hash rather than an array.',
		tdigest: 'Format: {compression: integer}: The compression parameter limits the maximum number of nodes to 20 * compression.',
		hdr: 'hdr object indicates that HDR Histogram should be used to calculate  the percentiles and specific settings for this algorithm can be specified inside the object. Format:  {number_of_significant_value_digits: integer}',
		script: 'Scripting supports parameterized input.',
	},
	scripted_metric: {
		__docs: 'A metric aggregation that executes using scripts to provide a metric output.',
		combine_script: 'Executed once on each shard after document collection is complete. Allows the aggregation to consolidate the state returned from each shard.',
		init_script: 'Executed prior to any collection of documents. Allows the aggregation to set up any initial state.',
		map_script: 'Executed once per document collected.',
		params: 'An object whose contents will be passed as variables to the init_script, map_script and combine_script. This can be useful to allow the user to control the behavior of the aggregation and for storing state between the scripts.',
		reduce_script: 'Executed once on the coordinating node after all shards have returned their results. The script is provided with access to a variable states which is an array of the result of the combine_script on each shard.',
	},
	stats: {
		__docs: 'Computes stats over numeric values extracted from the aggregated documents.',
		...metricFieldDocs,
		script: 'Scripting supports parameterized input.',
	},
	string_stats: {
		__docs: 'Computes statistics over string values extracted from the aggregated documents',
		...metricFieldDocs,
		show_distribution: 'The computation of the Shannon Entropy value is based on the probability of each character appearing in all terms collected by the aggregation. To view the probability distribution for all characters, we can add the show_distribution (default: false) parameter.',
		script: 'Scripting supports parameterized input.',
	},
	sum: {
		__docs: 'Sums up numeric values that are extracted from the aggregated documents.',
		...metricFieldDocs,
		script: 'Scripting supports parameterized input.',
	},
	t_test: {
		__docs: 'Performs a statistical hypothesis test in which the test statistic follows a Student’s t-distribution under the null hypothesis on numeric  values.',
		a: 'First field of numeric type.',
		b: 'Second field of numeric type.',
		type: 'The type of the test can be specified using the type parameter.'
	},
	top_hits: {
		__docs: 'Keeps track of the most relevant document being aggregated. This aggregator is intended to be used as a sub aggregator, so that the top matching documents can be aggregated per bucket.',
		from: 'The offset from the first result you want to fetch.',
		size: 'The maximum number of top matching hits to return per bucket. By default the top three matching hits are returned.',
		sort: 'How the top matching hits should be sorted. By default the hits are sorted by the score of the main query.',
		_source: 'Field names'
	},
	top_metrics: {
		__docs: 'Selects metrics from the document with the largest or smallest "sort" value.',
		metric: 'Selects the fields of the "top" document to return. You can request a single metric with something like "metric": {"field": "m"} or multiple metrics by requesting a list of metrics like "metric":  [{"field": "m"}, {"field": "i"}.',
		sort: 'Allows you to add one or more sorts on specific fields. Each sort can be reversed as well. The sort is defined on a per field level, with special field name for _score to sort by score, and _doc to sort by index order.',
		size: 'The maximum number of top matching hits to return per bucket. By default the top three matching hits are returned.'
	},
	value_count: {
		__docs: 'Counts the number of values that are extracted from the aggregated documents.',
		...metricFieldDocs
	},
	weighted_avg: {
		__docs: 'Computes the weighted average of numeric values that are extracted from the aggregated documents.',
		value: 'The configuration for the field or script that provides the values',
		weight: 'The configuration for the field or script that provides the weights',
		format: 'The numeric response formatter.',
		value_type: 'A hint about the values for pure scripts or unmapped fields.'
	},
	// adjacency_matrix: {
	// 	__docs: 'A bucket aggregation returning a form of adjacency matrix. The request provides a collection of named filter expressions, similar to the filters aggregation request.',
	// 	filters: 'Named list of Elasticsearch filters: { name1: {...}, ...}',
	// 	separator: 'Separator character used in response.'
	// },
	auto_date_histogram: {
		__docs: 'A multi-bucket aggregation similar to the Date histogram aggregation except instead of providing an interval to use as the width of each bucket, a target number of buckets is provided indicating the number of buckets needed and the interval of the buckets is automatically chosen to best achieve that target. The number of buckets returned will always be less than or equal to this target number.',
		...metricFieldDocs,
		buckets: 'The buckets field is optional, and will default to 10 buckets if not specified.',
		format: 'Date format pattern specification.',
		time_zone: 'The time_zone parameter can be used to indicate that bucketing should use a different time zone.',
		minimum_inteval: 'The minimum_interval allows the caller to specify the minimum rounding interval that should be used. This can make the collection process more efficient, as the aggregation will not attempt to round at any interval lower than minimum_interval.'
	},
	// children: {
	// 	__docs: 'A special single bucket aggregation that selects child documents that have the specified type, as defined in a join field.',
	// 	type: 'Points to type / mapping with the value as name'
	// },
	// composite: {
	// 	__docs: 'A multi-bucket aggregation that creates composite buckets from different sources.',
	// 	sources: 'The sources parameter controls the sources that should be used to build the composite buckets. The order that the sources are defined is important because it also controls the order the keys are returned.',
	// 	size: 'The size parameter can be set to define how many composite buckets  should be returned. Used for pagination.',
	// 	after: 'To get the next set of buckets, resend the same aggregation with the after parameter set to the after_key value returned in the response.  This request uses the after_key value provided in the previous response.'
	// },
	date_histogram: {
		__docs: 'This multi-bucket aggregation is similar to the normal histogram, but it can only be used with date values. Because dates are represented internally in Elasticsearch as long values, it is possible, but not as accurate, to use the normal histogram on dates as well.',
		...metricFieldDocs,
		__interval: 'Select among `interval` for ES < 7 datasets and `calendar_interval` and `fixed_interval` for ES >= 7.',
		time_zone: 'Use the time_zone parameter to indicate that bucketing should use  a different time zone.',
		order: 'The order of the buckets can be customized by setting the order  parameter.',
		min_doc_count: 'It is possible to only return terms that match more than a  configured number of hits using the min_doc_count option.'
	},
	date_range: {
		__docs: 'A range aggregation that is dedicated for date values. The main difference between this aggregation and the normal range aggregation is that the from and to values can be expressed in Date Math expressions, and it is also possible to specify a date format by which the from and to response fields will be returned.',
		...metricFieldDocs,
		format: 'Date Format/Pattern',
		ranges: 'Array of objects of shape {from: string, to: string} where the strings represent dates.',
		keyed: 'Setting the keyed flag to true will associate a unique string key with each bucket and return the ranges as a hash rather than an array.'
	},
	diversified_sampler: {
		__docs: 'Like the sampler aggregation this is a filtering aggregation used to limit any sub aggregations processing to a sample of the top-scoring documents. The diversified_sampler aggregation adds the ability to limit the number of matches that share a common value such as an "author".',
		...metricFieldDocs,
		execution_hint: 'The optional execution_hint setting can influence the management of the values used for de-duplication. Each option will hold up to `shard_size` values in memory while performing de-duplication but the type of value held can be controlled as follows: * hold field values directly (`map`) * hold ordinals of the field as determined by the Lucene index (`global_ordinals`) * hold hashes of the field values - with potential for hash collisions (`bytes_hash`)',
		max_docs_per_value: 'The max_docs_per_value is an optional parameter and limits how many documents are permitted per choice of de-duplicating value. The default setting is "1".',
		shard_size: 'The shard_size parameter limits how many top-scoring documents are collected in the sample processed on each shard. The default value is 100.'
	},
	// filter: {
	// 	__docs: 'Defines a single bucket of all the documents in the current document set context that match a specified filter. Often this will be used to narrow down the current aggregation context to a specific set of documents.',
	// 	filter: 'Elasticsearch filter object format.'
	// },
	// filters: {
	// 	__docs: 'Defines a multi bucket aggregation where each bucket is associated with a filter. Each bucket will collect all documents that match its associated filter.',
	// 	other_bucket: 'Can be set to add a bucket to the response which will contain all documents that do not match any of the given filters.',
	// 	other_bucket_key: 'Can be used to set the key for the other bucket to a value other than the default _other_. Setting this parameter will implicitly set the other_bucket parameter to true.',
	// 	filters: 'Named list of Elasticsearch filters: { name1: {...}, ...}'
	// },
	geo_distance: {
		__docs: 'A multi-bucket aggregation that works on geo_point fields and conceptually works very similar to the range aggregation. The user can define a point of origin and a set of distance range buckets.',
		...metricFieldDocs,
		origin: 'The `origin` point can accept all formats supported by the  `geo_point` type.',
		unit: 'By default, the distance unit is m (meters) but it can also accept:  mi (miles), in (inches), yd (yards), km (kilometers), cm (centimeters), mm (millimeters).',
		ranges: 'Array of objects of shape {from: string, to: string}',
		keyed: 'By default, the buckets are returned as an ordered array. It is also possible to request the response as a hash instead keyed by the buckets keys.',
		distance_type: 'The distance calculation type can be set using the distance_type parameter.'
	},
	geohash_grid: {
		__docs: 'A multi-bucket aggregation that works on geo_point fields and groups points into buckets that represent cells in a grid. The resulting grid can be sparse and only contains cells that have matching data.',
		precision: 'The string length of the geohashes used to define cells/buckets in the results. Defaults to 5.',
		size: 'The maximum number of geohash buckets to return (defaults to 10,000).',
		shard_size: 'To allow for more accurate counting of the top cells returned in the final result the aggregation defaults to returning max(10,(size x number-of-shards)) buckets from each shard. If this heuristic is undesirable, the number considered from each shard can be over-ridden using this parameter.'
	},
	// global: {
	// 	__docs: 'Defines a single bucket of all the documents within the search execution context. This context is defined by the indices and the document types you’re searching on, but is not influenced by the search query itself.',
	// },
	histogram: {
		__docs: 'A multi-bucket values source based aggregation that can be applied on numeric values extracted from the documents.',
		...metricFieldDocs,
		interval: 'When the aggregation executes, the selected field of every document will be evaluated and will be rounded down to its closest bucket.  Must be a positive decimal.',
		offset: 'Shifts bucket boundaries. Must be a decimal greater than or equal to 0 and less than interval.',
		min_doc_count: 'By default the response will fill gaps in the histogram with empty buckets. It is possible change that and request buckets with a higher minimum count thanks to the min_doc_count setting.',
		keyed: 'By default, the buckets are returned as an ordered array. It is also possible to request the response as a hash instead keyed by the buckets keys.',
		order: 'The order of the buckets can be customized by setting the order  parameter. ',
		extended_bounds: 'With extended_bounds setting, you now can "force" the histogram  aggregation to start building buckets on a specific min value and  also keep on building buckets up to a max value (even if there are  no documents anymore). Using extended_bounds only makes sense when  min_doc_count is 0 (the empty buckets will never be returned if  min_doc_count is greater than 0).'
	},
	// ip_range: {
	// 	__docs: 'A dedicated range aggregation for IP typed fields.',
	// 	...metricFieldDocs
	// },
	missing: {
		__docs: 'A field data based single bucket aggregation, that creates a bucket of all documents in the current document set context that are missing a field value (effectively, missing a field or having the configured NULL value set).',
		...metricFieldDocs
	},
	nested: {
		__docs: 'A special single bucket aggregation that enables aggregating nested documents.',
		path: 'Path of the nested documents within the top level documents.',
	},
	range: {
		__docs: 'A multi-bucket value source based aggregation that enables the user to define a set of ranges - each representing a bucket.',
		...metricFieldDocs,
		ranges: 'Set of ranges, each representing a bucket.',
		script: 'Scripting supports parameterized input.',
	},
	rare_terms: {
		__docs: 'Multi-bucket value source based aggregation which finds "rare" terms — terms that are at the long-tail of the distribution and are not frequent.',
		...metricFieldDocs,
		max_doc_count: 'The maximum number of documents a term should appear in.',
		precision: 'The precision of the internal CuckooFilters. Smaller precision  leads to better approximation, but higher memory usage.  Cannot be smaller than 0.00001. Default 0.01',
		include: 'Terms that should be included in the aggregation',
		exclude: 'Terms that should be excluded from the aggregation'
	},
	reverse_nested: {
		__docs: 'A special single bucket aggregation that enables aggregating on parent docs from nested documents. Effectively this aggregation can break out of the nested block structure and link to other nested structures or the root document, which allows nesting other aggregations that aren’t part of the nested object in a nested aggregation.',
		path: 'Path of the nested documents within the top level documents.'
	},
	sampler: {
		__docs: 'A filtering aggregation used to limit any sub aggregations processing to a sample of the top-scoring documents.',
		shard_size: 'The shard_size parameter limits how many top-scoring documents are collected in the sample processed on each shard. The default value is 100.'
	},
	significant_terms: {
		__docs: 'An aggregation that returns interesting or unusual occurrences of terms in a set.',
		...metricFieldDocs,
		min_doc_count: 'It is possible to only return terms that match more than a  configured number of hits using the min_doc_count option.',
		background_filter: 'The default source of statistical information for background term frequencies is the entire index and this scope can be narrowed through the use of a background_filter to focus in on significant terms within a narrower context.',
		jlh: 'The JLH score can be used as a significance score by adding `{}`.',
		mutual_information: 'Mutual information as described in "Information Retrieval", Manning et al., Chapter 13.5.1 can be used as significance score by adding `{}`',
		chi_square: 'Chi square as described in "Information Retrieval", Manning et al., Chapter 13.5.2 can be used as significance score by adding `{}`',
		gnd: 'Google normalized distance as described in "The Google Similarity Distance", Cilibrasi and Vitanyi, 2007 (http://arxiv.org/pdf/cs/0412098v3.pdf) can be used as significance score by adding `{}`',
		percentage: 'A simple calculation of the number of documents in the foreground sample with a term divided by the number of documents in the background with the term. By default this produces a score greater than zero and less than one.',
		script: 'Scripting supports parameterized input.',
	},
	significant_text: {
		__docs: 'An aggregation that returns interesting or unusual occurrences of free-text terms in a set.',
		...metricFieldDocs,
		filter_duplicate_text: 'Filtering near-duplicate text is a difficult task at index-time but we can cleanse the data on-the-fly at query time using the `filter_duplicate_text` setting.',
		background_filter: 'The default source of statistical information for background term frequencies is the entire index and this scope can be narrowed through the use of a background_filter to focus in on significant terms within a narrower context.',
		source_fields: 'List of JSON _source fields from which text will be analyzed.'
	},
	terms: {
		__docs: 'A multi-bucket value source based aggregation where buckets are  dynamically built - one per unique value.',
		...metricFieldDocs,
		size: 'By default, the terms aggregation will return the buckets for the top ten terms ordered by the doc_count. One can change this default behaviour by setting the size parameter.',
		collect_mode: 'Deferring calculation of child aggregations.',
		execution_hint: 'Mechanisms by which terms aggregations can be executed.',
		order: 'The order of the buckets can be customized by setting the order  parameter. '
	}
}
