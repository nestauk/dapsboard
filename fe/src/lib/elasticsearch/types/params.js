import {isNotNil, mergeObj} from '@svizzle/utils';

import {
	arrayOf,
	enumsOf,
	integer,
	intWithUnitOf,
	number,
	object,
	objectOf,
	shape,
	shapeKey,
	string,
	stringD,
	unionOf,
	xorOf,
} from '$lib/types/index.js';

/* conditions */

export const optionalKey = '__optional';
export const optional = mergeObj({[optionalKey]: true});

/* field object: to be used when the key is a field name, hence not known a priori */
const fieldKey = 'field';
export const fieldObjectOf = type => objectOf({[fieldKey]: type});

/* sorting */

export const sortOrderD = defaultOrder => enumsOf(['asc', 'desc'], defaultOrder);
export const sortOrder = sortOrderD();
export const sortOrderAsc = sortOrderD('asc');
export const sortOrderDesc = sortOrderD('desc');
export const sortOptions = objectOf({
	__orderBy: xorOf({
		_count: optional(enumsOf(['asc', 'desc'], 'desc')),
		_key: optional(enumsOf(['asc', 'desc'], 'asc')),
	})
});

/* dimensional types */

export const fixedInterval = intWithUnitOf(['ms', 's', 'm', 'h', 'd'], 'd');
export const calendarInterval = intWithUnitOf(['m', 'h', 'd', 'w', 'M', 'w', 'q', 'y'], 'y');
export const genericInterval = intWithUnitOf(['ms', 's', 'm', 'h', 'd', 'w', 'M', 'q', 'y'], 'y');

// TODO see time-units at https://www.elastic.co/guide/en/elasticsearch/reference/7.10/common-options.html#time-units
export const dateMathTimeUnits = enumsOf(['s', 'm', 'H', 'h', 'd', 'w', 'M', 'y']);

export const calendarIntervals = enumsOf(['m', 'h', 'd', 'w', 'M', 'w', 'q', 'y']);
export const calendarIntervalsFromMonth = enumsOf(['M', 'w', 'q', 'y']);
export const rateIntervalsToWeek = enumsOf([
	'second',
	'minute',
	'hour',
	'day',
	'week',
]);
export const rateIntervalsFromMonth = enumsOf([
	'month',
	'quarter',
	'year',
]);

/* special strings */

// https://www.elastic.co/guide/en/elasticsearch/reference/7.10/common-options.html#date-math
export const dateMathString = {
	...shape('dateMathString')(),
	...string,
	value: number,
	unit: dateMathTimeUnits
};

/* scripting */

const scriptKey = 'script';
export const scriptD = shape(scriptKey);
export const script = {
	...scriptD(),
	id: optional(string),
	lang: optional(stringD('painless')),
	params: object,
	source: string, // TODO I think this should be in a `someOf` or `xorOf` with `id`
};
export const scriptOf = ({id, lang, params, source}, __default, __isAppDefault) => ({
	...isNotNil(__default) ? {__default} : {},
	...isNotNil(__isAppDefault) ? {__isAppDefault} : {},
	[shapeKey]: scriptKey,
	id,
	lang,
	params,
	source,
});

export const metricScript = unionOf(string, objectOf({id: string}));

/*
regex
https://www.elastic.co/guide/en/elasticsearch/reference/7.9/regexp-syntax.html
*/

const regexKey = 'regex';
export const regexD = shape(regexKey);
export const regex = regexD();

/* filtering */

// https://www.elastic.co/guide/en/elasticsearch/reference/7.9/search-aggregations-bucket-terms-aggregation.html#_filtering_values_with_partitions
const partition = objectOf({
	partition: integer,
	num_partitions: integer
});

export const termsExclude = unionOf(
	arrayOf(string),
	regex,
);

export const termsInclude = unionOf(
	arrayOf(string),
	partition,
	regex,
);
