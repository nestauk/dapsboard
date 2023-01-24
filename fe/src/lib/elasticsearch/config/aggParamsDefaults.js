export default {
	adjancency_matrix: {
		separator: '@' // ES default
	},
	auto_date_histogram: {
		buckets: 10, // ES default
		format: 'YYYYMMdd', // Dapsboard default
		time_zone: 'UTC', // ES default
	},
	cardinality: {
		precision_threshold: 3000 // ES default
	},
	// composite: {
	// 	// FIXME
	// 	sources: {
	// 		order: "desc", // ES default
	// 	}
	// },
	date_histogram: {
		min_doc_count: 1, // Dapsboard default
		order: {
			_count: "desc", // ES default
		},
		time_zone: 'UTC', // ES default
		__interval: {
			__type: 'interval', // Dapsboard internal
			interval: '1y', // Dapsboard default
			fixed_interval: '1y', // Dapsboard default
			calendar_interval: '1y', // Dapsboard default
		}
	},
	date_range: {
		format: 'YYYYMMdd', // Dapsboard default
		keyed: false, // ES default
	},
	diversified_sampler: {
		/*
		* ES default: The default setting is to use `global_ordinals` if this
		* information is available from the Lucene index and reverting to `map`
		* if not.
		*/
		execution_hint: 'global_ordinals',
		max_docs_per_value: 1, // ES default
		shard_size: 100, // ES default
	},
	extended_stats: {
		sigma: 2 // ES default
	},
	// filters: {
	// 	other_bucket: false, // not explicitly stated in the docs, must test
	// 	other_bucket_key: '_other_' // ES default
	// },
	geo_bounds: {
		wrap_longitude: true // ES default
	},
	geo_distance: {
		distance_type: 'arc', // ES default
		keyed: false, // ES default
		unit: 'm', // ES default
	},
	geohash_grid: {
		precision: 3, // Dapsboard default, // [1]
		size: 10000, // ES default
		// shard_size: // ES default is -> max(10,(size x number-of-shards)) buckets from each shard.
	},
	histogram: {
		keyed: false, // ES default
		min_doc_count: 1, // Dapsboard default
		offset: 0, // ES default
		order: {
			_count: "desc" // ES default
		},
		// tentative template for handling computed defaults in the future
		// interval: (dataset, field, type) => // TODO compute default based on some stats request
	},
	median_absolute_deviation: {
		compression: 100, // ES default
	},
	percentile_ranks: {
		keyed: true // ES default
	},
	percentiles: {
		keyed: true, // ES default
		percents: [1, 5, 25, 50, 75, 95, 99], // ES default
		tdigest: {
			compression: 100 // ES default
		}
	},
	rare_terms: {
		precision: 0.01, // ES default
	},
	reverse_nested: {
		path: '' // ES default
	},
	sampler: {
		shard_size: 100 // ES default
	},
	significant_terms: {
		min_doc_count: 1, // Dapsboard default
	},
	significant_text: {
		filter_duplicate_text: false // ES default
	},
	terms: {
		// tentative template for handling computed defaults in the future
		// collect_mode: (dataset, field, type) => // TODO compute default based on cardinality request
		/*
		* Per ES below, `breadth_first` is the default mode for fields with a cardinality
		* bigger than the requested size or when the cardinality is unknown
		* (numeric fields or scripts for instance).
		*/
		collect_mode: 'depth_first',
		/*
		* Per ES below, `global_ordinals` is the default option for keyword field, it uses
		* global ordinals to allocate buckets dynamically so memory usage is linear to the
		* number of values of the documents that are part of the aggregation scope.
		*/
		execution_hint: 'global_ordinals',
		size: 10, // ES default
		order: {
			_count: "desc" // ES default
		},
	},
	top_hits: {
		order: {
			_count: "desc" // ES default
		},
		size: 3, // ES default
	},
	weighted_avg: {
		value: (dataset, field) => ({field}), // Dapsboard default
		weight: {
			script: '1' // Dapsboard default
		},
	}
}

// [1] using 5 causes: `Trying to create too many buckets. Must be less than or equal to: [10000] but was [15010]. This limit can be set by changing the [search.max_buckets] cluster level setting.`
