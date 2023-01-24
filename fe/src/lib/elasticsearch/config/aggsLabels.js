export const metricLabels = {
	// boxplot: 'BoxPlot',
	// scripted_metric: 'Scripted Metric',
	// string_stats: 'String Statistics',
	// string_stats: 'String Stats' // >= 7.6
	avg: 'Average',
	cardinality: 'Cardinality',
	extended_stats: 'Extended Statistics',
	geo_bounds: 'Geographic Bounds',
	geo_centroid: 'Geographic Centroid',
	max: 'Maximum',
	median_absolute_deviation: 'Median Abs. Dev.', // >= 6.6
	min: 'Minimum',
	percentile_ranks: 'Percentile Ranks',
	percentiles: 'Percentiles',
	stats: 'Statistics',
	sum: 'Sum',
	top_hits: 'Top Hits',
	value_count: 'Value Count'
}

export const metricMultiFieldLabels = {
	// matrix_stats: 'Matrix Stats',
	weighted_avg: 'Weighted Average',
}

export const topBucketLabels = {
	// global: 'Global'
}

export const bucketLabels = {
	// auto_date_histogram: 'Auto Date Histogram' // >= 6.5
	// children: 'Children',
	auto_date_histogram: 'Auto Date Histogram',
	date_histogram: 'Date Histogram',
	date_range: 'Date Range',
	geo_distance: 'Geo Distance',
	geohash_grid: 'Geo Hash',
	histogram: 'Histogram',
	// ip_range: 'IP Range',
	missing: 'Missing',
	nested: 'Nested',
	range: 'Range',
	rare_terms: 'Rare Terms',
	significant_terms: 'Significant Terms',
	significant_text: 'Significant Text',
	terms: 'Terms',
}

// needs to have sub-aggs to work
export const bucketParentLabels = {
	sampler: 'Sampler',
}
export const bucketMultiFieldLabels = {
	// composite: 'Composite',
	// filter: 'Filter',
	// filters: 'Filters',
}

export const nestedBucketLabels = {
	diversified_sampler: 'Diversified Sampler',
	reverse_nested: 'Reverse Nested',
}
