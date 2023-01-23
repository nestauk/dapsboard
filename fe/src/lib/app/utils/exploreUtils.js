import * as _ from 'lamb';

import {getApiVersionOf, getSchemaOf} from '$lib/app/utils/data';
import {getDatasetIdOf} from '$lib/utils/specs';

import * as aggsById from '$lib/elasticsearch/aggs';
import {makeRequestToQuery} from '$lib/elasticsearch/aggs/utils/query';
import {makeIsAggVersionCompatible} from '$lib/elasticsearch/aggs/utils/version';

import {aggHasNoRequiredParamsWithoutDefault} from '$lib/elasticsearch/types/aggs.utils';
import * as esTypes from '$lib/elasticsearch/types/fields';
import {isWithKeywordTypeId} from '$lib/elasticsearch/types/fields.utils';

import * as types from '$lib/types';
import {makeIsTypeCompatibleWithType} from '$lib/types/utils';

import {arrayToObjectWith} from '$lib/utils/svizzle/utils/[any-array]-[array-object]';

export const aggs = _.values(aggsById);
export const allTypes = {...types, ...esTypes};

/* URL */

export const makeExploreQuery = ({fields, project, version}) => {
	let query = `project=${project}&version=${version}`;

	if (fields) {
		query = `${query}&fields=${fields.join(',')}`
	}

	return query;
}

export const makeExploreIndexPath = ({project, source, version}) =>
	`/explore?source=${source}&${makeExploreQuery({project, version})}`;

export const makeExplorePath = ({fields, project, source, version}) =>
	`/explore/${source}?${makeExploreQuery({fields, project, version})}`;

/* ES query */

const getCompatibleAggs = (type, apiVersion) => _.filter(aggs, _.allOf([
	makeIsAggVersionCompatible(apiVersion),
	_.pipe([_.getKey('fieldType'), makeIsTypeCompatibleWithType(type)]),
	_.pipe([_.getKey('request'), aggHasNoRequiredParamsWithoutDefault]),
]));

export const selectionToAggsQuery = ({fields, project, source, version}) => {
	// use only the first field for now
	const [fieldName] = fields;

	// inspect dataset spec
	const apiVersion = getApiVersionOf({project, source, version});
	const schema = getSchemaOf({project, source, version});
	const datasetId = getDatasetIdOf({project, source, version});

	// get field type
	const fieldTypeId = schema[fieldName] && schema[fieldName].type;
	const fieldType = allTypes[fieldTypeId] || allTypes.any;

	// filter aggs
	const compatibleAggs = getCompatibleAggs(fieldType, apiVersion);

	// make query
	const esFieldName = isWithKeywordTypeId(fieldTypeId)
		? `${fieldName}.keyword`
		: fieldName;
	const requestToQuery = makeRequestToQuery(esFieldName);
	const aggsToObject = arrayToObjectWith(agg => [
		`${datasetId}.${fieldName}.${agg.id}.${agg.response.id}`,
		{[agg.id]: requestToQuery(agg.request)}
	]);

	const query = {
		aggs: aggsToObject(compatibleAggs),
		size: 0,
	};

	return query;

	// TODO #220: add to the URL as `&preference=...` for caching
	// import {joinWithDash} from '@svizzle/utils';
	// const makePreferenceKey = _.pipe([_.pluck('id'), joinWithDash]);
	// const preference =
	// 	`${datasetId}.${fieldName}.${makePreferenceKey(compatibleAggs)}`;
	//
	// return {preference, query};
};

/* other */

export const makeDepthByField = _.pipe([
	_.mapWith((x, i) => [x, i + 1]),
	_.fromPairs,
]);
