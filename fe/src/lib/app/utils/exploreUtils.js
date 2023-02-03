import {
	getId,
	makeIsIncluded,
	makeMergeAppliedFnMap,
	transformValues
} from '@svizzle/utils';
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
import {getDatasetIdOf} from '$lib/utils/specs.js';

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
	_.pipe([getId, _.not(makeIsIncluded(['stats', 'top_hits']))])
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
]);

const makeEsFieldName = (fieldName, fieldTypeId) =>
	isWithKeywordTypeId(fieldTypeId) ? `${fieldName}.keyword` : fieldName;

// edit `request.field`
const makeEditAggRequest = esFieldName => transformValues({
	request: makeMergeAppliedFnMap({
		field: req => _.has(req, 'field') ? esFieldName : undefined,
	})
});

// FIXME amount should be based on order of magnitude of amount of hierarchy
// nodes: for now assuming we won't have more than 999 nodes
export const padZeroesLeft = str => _.padLeft(str, 0, 3);

export const selectionToAggsHierarchy = ({fields, project, source, version}) => {
	// get dataset spec
	const apiVersion = getApiVersionOf({project, source, version});
	const schema = getSchemaOf({project, source, version});
	const datasetId = getDatasetIdOf({project, source, version});

	// console.log('fields', fields);

	const fieldCount = 2;
	const aggsLayers = _.map(_.takeFrom(fields, fieldCount), fieldName => {
		const fieldTypeId = schema[fieldName]?.type;

		if (!fieldTypeId) {
			return [];
		}

		const fieldType = allTypes[fieldTypeId] || allTypes.any;
		const esFieldName = makeEsFieldName(fieldName, fieldTypeId);
		const compatibleAggs = getCompatibleAggs(fieldType, apiVersion);
		const editAggRequestField = makeEditAggRequest(esFieldName);
		const editedCompatibleAggs = _.map(compatibleAggs, editAggRequestField);

		return editedCompatibleAggs;
	});
	// console.log('aggsLayers', aggsLayers);

	const hierarchy = {};
	for (
		let
			collectedNodes,
			depth = aggsLayers.length - 1,
			idx,
			index = 0;
		depth >= 0;
		depth--
	) {
		const preCollectedNodes = collectedNodes;
		collectedNodes = [];

		_.forEach(aggsLayers[depth], agg => {
			index += 1;
			idx = padZeroesLeft(index);
			collectedNodes.push(idx);
			// FIXME 1. centralise 'noField', used in 2 places
			// FIXME 2. use it at all?
			const fieldName = agg.request.field?.replace('.keyword', '') || 'noField';
			const id = `${datasetId}.${fieldName}.${agg.id}.${agg.response.id}`;
			const node = {agg, datasetId, depth, fieldName, id, idx};
			if (agg.tag === 'bucketing' && agg.subAggs && preCollectedNodes) {
				node.children = preCollectedNodes;
			}
			hierarchy[idx] = node;
		});
	}
	// console.log('hierarchy', hierarchy);

	return hierarchy
};

/* other */

export const makeDepthByField = _.pipe([
	_.mapWith((x, i) => [x, i + 1]),
	_.fromPairs,
]);
