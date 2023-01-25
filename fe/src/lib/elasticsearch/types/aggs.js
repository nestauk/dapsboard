import {
	calendarInterval,
	fixedInterval,
	genericInterval,
	optional,
	script,
	sortOptions,
	termsExclude,
	termsInclude,
} from '$lib/elasticsearch/types/params';
import {
	booleanD,
	enumsOf,
	extentOf,
	integer,
	integerD,
	native,
	numberOrString,
	objectOf,
	string,
	stringD,
	xorOf,
} from '$lib/types';

export const baseAggFor = fieldType => ({
	field: string,
	missing: optional(numberOrString(fieldType))
});

export const dateHistogramAggFor = fieldType => objectOf({
	...baseAggFor(fieldType),
	__intervals: xorOf({
		interval: genericInterval,
		calendar_interval: calendarInterval,
		fixed_interval: fixedInterval
	}),
	// extended_bounds: optional(extentOf(esDates)),
	format: optional(string), // [1]
	keyed: optional(booleanD(false)),
	min_doc_count: optional(integerD(1, true)),
	offset: optional(string), // [2]
	order: optional(sortOptions),
	time_zone: stringD('UTC'),
});

export const histogramAggFor = fieldType => objectOf({
	...baseAggFor(fieldType),
	extended_bounds: optional(extentOf(native(fieldType)())),
	interval: native(fieldType)(),
	keyed: optional(booleanD(false)),
	min_doc_count: optional(integerD(1, true)),
	offset: optional(native(fieldType)(0)),
	order: optional(sortOptions),
});

export const termsAggFor = fieldType => objectOf({
	...baseAggFor(fieldType),
	/*
	* Per ES below, `breadth_first` is the default mode for fields with a cardinality
	* bigger than the requested size or when the cardinality is unknown
	* (numeric fields or scripts for instance).
	*/
	collect_mode: enumsOf(['depth_first', 'breadth_first'], 'depth_first'),
	exclude: optional(termsExclude),
	/*
	* Per ES below, `global_ordinals` is the default option for keyword field, it uses
	* global ordinals to allocate buckets dynamically so memory usage is linear to the
	* number of values of the documents that are part of the aggregation scope.
	*/
	execution_hint: enumsOf(['global_ordinals', 'map'], 'global_ordinals'),
	include: optional(termsInclude),
	min_doc_count: optional(integerD(1)),
	order: optional(sortOptions),
	script: optional(script),
	shard_size: optional(integer),
	size: optional(integerD(10)),
	// shard_min_doc_count: optional(integerD(0)),
});
