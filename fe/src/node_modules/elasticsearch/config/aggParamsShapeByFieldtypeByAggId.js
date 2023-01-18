import * as _ from 'lamb';

import aggsIdByFieldType from 'elasticsearch/config/aggsIdByFieldType';
import {
	baseAggFor,
	dateHistogramAggFor,
	histogramAggFor,
	termsAggFor,
} from 'elasticsearch/types/aggs';
import {
	fieldObjectOf,
	metricScript,
	optional,
	script,
	sortOrder,
	termsExclude,
	termsInclude,
} from 'elasticsearch/types/params';
import {geoBounds, geoPointString} from 'elasticsearch/types/fields';
import {
	arrayOf,
	boolean,
	booleanD,
	enumsOf,
	float,
	floatD,
	integer,
	integerD,
	intWithin,
	number,
	object,
	objectD,
	objectifyValues,
	objectOf,
	recordLike,
	string,
	someOf,
	stringD,
	unionOf,
	xorOf,
} from 'types';

/* params */

const staticParamsShapeByMetricAgg = {
	geo_centroid: {
		field: string,
	},
	scripted_metric: {
		combine_script: metricScript,
		init_script: optional(metricScript),
		map_script: metricScript,
		params: optional(object),
		reduce_script: metricScript,
	},
	top_hits: {
		_source: optional(objectOf({
			includes: unionOf(string, arrayOf(string))
		})),
		from: optional(integerD(0, true)),
		size: optional(integerD(3)),
		sort: optional(arrayOf(recordLike({
			values: objectOf({
				order: sortOrder
			})
		}))),
	},
	value_count: {
		field: string,
		script: optional(script),
	},
};

const makeParamsShapeByMetricAgg = fieldType => ({
	avg: {
		...baseAggFor(fieldType),
		script: optional(script),
	},
	boxplot: {
		...baseAggFor(fieldType),
		compression: optional(integer),
		script: optional(script)
	},
	cardinality: {
		...baseAggFor(fieldType),
		precision_threshold: optional(integerD(3000)),
		script: optional(script),
	},
	extended_stats: {
		...baseAggFor(fieldType),
		sigma: optional(floatD(2)),
		script: optional(script),
	},
	geo_bounds: {
		...baseAggFor(fieldType), // `missing` will be: `optional(geoPointString),`
		wrap_longitude: optional(booleanD(true)),
	},
	max: {
		...baseAggFor(fieldType),
		script: optional(script),
	},
	median_absolute_deviation: {
		...baseAggFor(fieldType),
		compression: optional(integerD(100)),
		script: optional(script),
	},
	min: {
		...baseAggFor(fieldType),
		script: optional(script),
	},
	percentile_ranks: {
		...baseAggFor(fieldType),
		hdr: optional(objectOf({
			number_of_significant_value_digits: integer
		})),
		keyed: optional(booleanD(true)),
		script: optional(script),
		values: arrayOf(float),
	},
	percentiles: {
		...baseAggFor(fieldType),
		hdr: optional(objectOf({
			number_of_significant_value_digits: integer
		})),
		keyed: optional(booleanD(true)),
		percents: optional(arrayOf(float, [1, 5, 25, 50, 75, 95, 99])),
		script: optional(script),
		tdigest: optional(objectOf({
			compression: integerD(100)
		})),
	},
	stats: {
		...baseAggFor(fieldType),
		script: optional(script),
	},
	string_stats: {
		...baseAggFor(fieldType),
		show_distribution: optional(boolean),
		script: optional(script),
	},
	sum: {
		...baseAggFor(fieldType),
		script: optional(script),
	},
	t_test: {
		a: objectOf({
			field: string,
			filter: optional(object),
			script: optional(script),
		}),
		b: objectOf({
			field: string,
			filter: optional(object),
			script: optional(script),
		}),
		type: enumsOf(['paired', 'homoscedastic', 'heteroscedastic'])
	},
	top_metrics: {
		metrics: unionOf(
			fieldObjectOf(string),
			arrayOf(fieldObjectOf(string))
		),
		size: optional(integerD(1)),
		sort: unionOf(
			fieldObjectOf(sortOrder),
			fieldObjectOf(objectOf({
				order: sortOrder,
				numeric_type: string // [1]
			})),
			objectOf({
				_geo_distance: objectOf({
					location: geoPointString
				}),
			}),
			enumsOf(['_score']),
		),
	},
	weighted_avg: {
		format: optional(object),
		value_type: optional(object),
		value: objectOf({
			...baseAggFor(fieldType),
			script: optional(script),
		}),
		weight: objectOf({
			...baseAggFor(fieldType),
			script: optional(script),
		}),
	},
});

const staticParamsShapeByBucketingAgg = {
	geohash_grid: {
		field: string,
		bounds: optional(geoBounds),
		precision: optional(intWithin([0, 12], 5)),
		shard_size: optional(integer),
		size: optional(integerD(10000)),
	},
	missing: {
		field: string,
	},
	significant_terms: {
		__algorithms: optional(xorOf({
			chi_square: optional(objectD({})),
			gnd: optional(objectD({})),
			jlh: optional(objectD({})),
			percentage: optional(objectD({})),
		})),
		background_filter: optional(objectOf({term: object})),
		exclude: optional(termsExclude),
		field: string,
		include: optional(termsInclude),
		min_doc_count: optional(integerD(3)),
		mutual_information: optional(objectOf({
			include_negatives: optional(boolean),
			background_is_superset: optional(boolean)
		})),
		script: optional(script),
		shard_size: optional(integer), // [2]
		size: optional(integerD(10)), // [2]
	},
	significant_text: {
		background_filter: optional(objectOf({term: object})),
		exclude: optional(termsExclude),
		field: string,
		filter_duplicate_text: optional(booleanD(false)),
		include: optional(termsInclude),
		min_doc_count: optional(integerD(3)),
		shard_size: optional(integer), // [1]
		size: optional(integerD(10)), // [1]
		source_fields: optional(arrayOf(string))
	},
};

const makeParamsShapeByBucketingAgg = fieldType => ({
	auto_date_histogram: {
		...baseAggFor(fieldType),
		buckets: optional(integerD(10)),
		format: optional(stringD('YYYYMMdd', true)),
		minimum_inteval: optional(integer),
		time_zone: optional(stringD('UTC')),
	},
	date_histogram: dateHistogramAggFor(fieldType),
	date_range: {
		...baseAggFor(fieldType),
		format: stringD('YYYYMMdd', true),
		keyed: optional(booleanD(false)),
		ranges: arrayOf(objectOf({
			key: optional(string),
			from: optional(string),
			to: optional(string),
		})),
	},
	diversified_sampler: {
		...baseAggFor(fieldType),
		execution_hint: optional(
			enumsOf(['map', 'global_ordinals', 'bytes_hash'], 'global_ordinals')
		),
		max_docs_per_value: optional(integerD(1)),
		shard_size: optional(integerD(100)),
	},
	geo_distance: {
		...baseAggFor(fieldType),
		distance_type: enumsOf(['arc', 'plane'], 'arc'),
		keyed: optional(booleanD(false)),
		origin: string,
		ranges: arrayOf(object),
		unit: enumsOf(['m', 'mi', 'in', 'yd', 'km', 'cm', 'mm'], 'm'),
	},
	histogram: histogramAggFor(fieldType),
	range: {
		field: string,
		keyed: optional(booleanD(false)),
		ranges: arrayOf(objectOf({
			key: optional(string),
			__extent: someOf({
				from: number,
				to: number,
			}),
		})),
		script: optional(script)
	},
	rare_terms: {
		...baseAggFor(fieldType),
		exclude: optional(termsExclude),
		include: optional(termsInclude),
		max_doc_count: optional(integerD(1)),
		precision: optional(floatD(0.01)),
	},
	terms: termsAggFor(fieldType),
});

const makeAggParamShapeByAggId = fieldType => objectifyValues({
	...staticParamsShapeByMetricAgg,
	...makeParamsShapeByMetricAgg(fieldType),
	...staticParamsShapeByBucketingAgg,
	...makeParamsShapeByBucketingAgg(fieldType),
});

const aggParamsShapeByFieldtypeByAggId = _.mapValues(
	aggsIdByFieldType,
	(...[,fieldType]) => makeAggParamShapeByAggId(fieldType)
);

export default aggParamsShapeByFieldtypeByAggId;

/*
[1]
sources: [
	{ "product": { "terms" : { "field": "product" } } },
	{ "histo": { "histogram" : { "field": "price", "interval": 5 } } }
	{ "date": { "date_histogram" : { "field": "timestamp", "calendar_interval": "1d" } } }
]

[2]
using `5` causes: `Trying to create too many buckets. Must be less than or equal to: [10000] but was [15010]. This limit can be set by changing the [search.max_buckets] cluster level setting.`
*/
