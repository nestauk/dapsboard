import {
	arrayOf,
	integer,
	numberWithin,
	object,
	objectOf,
	pairOf,
	shape,
	string,
	unionOf,
} from '$lib/types';

/* ES date fields */

export const date = {
	...shape('date')(),
	...string,
	// TODO
	// a generic date can actually be a timestamp or a string
	// should we use unionOf(string, integer) ?
	// are we already using it specifically as a string?
	// do we break something if we change?
};

// 2018-06-29
export const date_YYYYMMDD_dash = {
	...shape('date_YYYYMMDD_dash')(),
	...string,
	regex: /\d{4}-\d{2}-\d{2}/gu
};

// 2018-06-29 15:27:10
export const date_YYYYMMDD_dash_time = {
	...shape('date_YYYYMMDD_dash_time')(),
	...string,
	regex: /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/gu
};

// 2018-06-29T15:27:10.000Z
export const date_YYYYMMDD_T_dash_time_ms = {
	...shape('date_YYYYMMDD_T_dash_time_ms')(),
	...string,
	regex: /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/gu
};

/*
Geo-point datatype
https://www.elastic.co/guide/en/elasticsearch/reference/7.4/geo-point.html
{
  "text": "Geo-point as an object",
  "location": {
    "lat": 41.12,
    "lon": -71.34
  }
}
{
  "text": "Geo-point as a string",
  "location": "41.12,-71.34"
}
{
  "text": "Geo-point as a geohash",
  "location": "drm3btev3e86"
}
{
  "text": "Geo-point as an array",
  "location": [ -71.34, 41.12 ]
}
{
  "text": "Geo-point as a WKT POINT primitive",
  "location" : "POINT (-71.34 41.12)"
}
*/

export const latitude = numberWithin([-90, 90]);
export const longitude = numberWithin([-180, 180]);
export const geoPointHash = {
	...shape('geoHash')(),
	...string,
	length: integer,
	regex: string
}
export const geoPointHashOf = length => ({
	...geoPointHash,
	regex: `[\\w\\d]${length}`,
});
export const geoPointObject = objectOf({
	lat: latitude,
	lon: longitude,
});
export const geoPointString = {
	...string,
	format: `{latitude},{longitude}` // TODO function of those 2 types, how?
};
export const geoPointPair = pairOf(longitude, latitude);
export const geoPointWKTString = {
	...string,
	format: `POINT ({longitude} {latitude})` // TODO function of those 2 types, how?
}

export const geoPoint = unionOf(
	geoPointHash,
	geoPointObject,
	geoPointString,
	geoPointPair,
	geoPointWKTString,
);

export const geoBounds = objectOf({
	top_left: geoPointString,
	bottom_right: geoPointString,
});

/* ES string fields */

export const keyword = {
	...shape('keyword')(),
	...string,
};
export const keywordArray = arrayOf(keyword);

export const objectArray = arrayOf(object);

export const text = {
	...shape('text')(),
	...string,
};
export const textArray = arrayOf(text);

export const textWithKeyword = {
	...shape('textWithKeyword')(),
	...string,
};
export const textWithKeywordArray = arrayOf(textWithKeyword);

export const urlString = {
	...shape('URL')(),
	...string,
	regex: /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gu
};
