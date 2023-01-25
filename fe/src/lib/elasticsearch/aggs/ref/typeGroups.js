import {
	date_YYYYMMDD_dash_time,
	date_YYYYMMDD_dash,
	date_YYYYMMDD_T_dash_time_ms,
	date,
	geoPointObject,
	keyword,
	keywordArray,
	text,
	textArray,
	textWithKeyword,
	textWithKeywordArray,
} from '$lib/elasticsearch/types/fields.js';
import {
	boolean,
	float,
	integer,
	unionOf,
} from '$lib/types/index.js';

export const esDates = unionOf(
	date,
	date_YYYYMMDD_dash,
	date_YYYYMMDD_dash_time,
	date_YYYYMMDD_T_dash_time_ms
);

export const esNumeric = unionOf(
	boolean,
	date,
	date_YYYYMMDD_dash,
	date_YYYYMMDD_dash_time,
	float,
	integer,
);

export const esNumericButBoolean = unionOf(
	date,
	date_YYYYMMDD_dash,
	date_YYYYMMDD_dash_time,
	float,
	integer,
);

export const esSearchableField = unionOf(
	boolean,
	date_YYYYMMDD_dash_time,
	date_YYYYMMDD_dash,
	date,
	float,
	geoPointObject,
	integer,
	keyword,
	keywordArray,
	textWithKeyword,
	textWithKeywordArray,
);

export const esSearchableString = unionOf(
	keyword,
	keywordArray,
	textWithKeyword,
	textWithKeywordArray,
);

export const esStrings = unionOf(
	keyword,
	keywordArray,
	text,
	textArray,
	textWithKeyword,
	textWithKeywordArray,
);

// TODO at some point we might need to use
// https://www.elastic.co/guide/en/elasticsearch/reference/7.9/mapping-types.html
