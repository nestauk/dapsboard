import {makeMergeAppliedFnMap, transformValues} from '@svizzle/utils';
import * as _ from 'lamb';

import {getApiVersionOf, getSchemaOf} from '$lib/app/utils/data.js';
import * as aggsById from '$lib/elasticsearch/aggs/index.js';
import {makeIsAggVersionCompatible} from '$lib/elasticsearch/aggs/utils/version.js';
import {aggHasNoRequiredParamsWithoutDefault} from '$lib/elasticsearch/types/aggs.utils.js';
import * as esTypes from '$lib/elasticsearch/types/fields.js';
import {isWithKeywordTypeId} from '$lib/elasticsearch/types/fields.utils.js';
import * as types from '$lib/types/index.js';
import {getDefault, hasDefault} from '$lib/types/index.js';
import {makeIsTypeCompatibleWithType} from '$lib/types/utils.js';

export const allAggs = _.values(aggsById);
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

const getCompatibleAggs = (type, apiVersion) => _.filter(allAggs, _.allOf([
	makeIsAggVersionCompatible(apiVersion),
	_.pipe([_.getKey('fieldType'), makeIsTypeCompatibleWithType(type)]),
]));

export const isValidAgg = _.pipe([
	_.getKey('request'),
	aggHasNoRequiredParamsWithoutDefault
]);

export const useDefaults = _.pipe([
	_.collect([
		_.pipe([
			_.skipIf(_.isNil),
			_.pickIf(hasDefault),
			_.mapValuesWith(getDefault)
		]),
		_.pick(['field']),
	]),
	_.apply(_.merge)
])

export const selectionToAggs = ({fields, project, source, version}) => {
	// use only the first field for now
	const [fieldName] = fields;

	// inspect dataset spec
	const apiVersion = getApiVersionOf({project, source, version});
	const schema = getSchemaOf({project, source, version});

	// get field type
	const fieldTypeId = schema[fieldName] && schema[fieldName].type;
	const fieldType = allTypes[fieldTypeId] || allTypes.any;

	// filter aggs
	const compatibleAggs = getCompatibleAggs(fieldType, apiVersion);

	// add `request.field`
	const esFieldName = isWithKeywordTypeId(fieldTypeId)
		? `${fieldName}.keyword`
		: fieldName;
	const selectionAggs = _.map(
		compatibleAggs,
		transformValues({
			request: makeMergeAppliedFnMap({
				field: obj => _.has(obj, 'field') ? esFieldName : undefined,
			})
		}),
	);

	return selectionAggs;
};

/* other */

export const makeDepthByField = _.pipe([
	_.mapWith((x, i) => [x, i + 1]),
	_.fromPairs,
]);
