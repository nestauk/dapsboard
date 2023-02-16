import * as _ from 'lamb';
import {isIterableEmpty} from '@svizzle/utils';

/* trandsformations */

export const initSelectedFieldSetsMap = _.pipe([
	_.mapWith(_.collect([
		_.getKey('id'),
		_.always(false)
	])),
	_.fromPairs
]);

export const initSelectedFieldsMap = _.pipe([
	_.mapWith(_.collect([
		_.identity,
		_.always(false)
	])),
	_.fromPairs
]);

export const makeGetFieldSetsFor = fieldIds => _.pipe([
	_.pick(fieldIds),
	_.values,
]);

export const makeGetSelectedFields = (fieldSets, fieldIds) => _.pipe([
	_.pick(fieldIds),
	_.values,
	_.mapWith(_.getKey('fields')),
	_.unless(isIterableEmpty, _.reduceRightWith(_.intersection, fieldSets))
])

export const getTruthyKeys = _.pipe([
	_.pairs,
	_.filterWith(_.getAt(1)),
	_.mapWith(_.getAt(0)),
]);

/* data formatting */

export const getPercent = (value, total) => `${Math.round(value / total * 100)}%`;
