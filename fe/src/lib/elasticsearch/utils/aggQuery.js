import * as _ from 'lamb';

import aggsIdByFieldType from '$lib/elasticsearch/config/aggsIdByFieldType.js';
import {getESType} from '$lib/utils/specs.js';

const hasKeywordField = _.anyOf([
	_.is('textWithKeyword'),
	_.is('textWithKeywordArray'),
]);

const createKeywordFieldQuery = fieldName => ({field: `${fieldName}.keyword`});

function defaultAggregationFactory (fieldName, fieldSpec) {
	const fieldType = getESType(fieldSpec);
	if (hasKeywordField(fieldType)) {
		return createKeywordFieldQuery(fieldName);
	}
	return { field: fieldName };
}

const queryFactories = {
	// composite: () => ({}),
	// filter: () => ({}),
	// filters: () => ({}),
	// sampler: () => ({}),
	// eslint-disable-next-line no-unused-vars
	weighted_avg: () => ({})
}

export function buildAggregation (aggId, fieldName, fieldSpec) {
	if (aggId in queryFactories) {
		return queryFactories[aggId](fieldName, fieldSpec);
	}

	return defaultAggregationFactory(fieldName, fieldSpec);
}

export function constructQuery (schema) {
	const aggs = {};
	for (let fieldName in schema) {
		const fieldType = getESType(schema[fieldName]);
		const aggIds = aggsIdByFieldType[fieldType];
		for (let i in aggIds) {
			const aggId = aggIds[i];
			const aggKey = `${fieldName}_${aggId}`;
			aggs[aggKey] = {
				[aggId]: buildAggregation(aggId, fieldName, schema[fieldName])
			};
		}
	}

	return {
		size: 0,
		aggs
	};
}
