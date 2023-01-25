import * as _ from 'lamb';
import {
	makeIsIncluded,
	makeMergeAppliedFnMap,
	valuesWith,
} from '@svizzle/utils';
import {
	nativeKey,
	shapeKey,
	defaultKey,
	isAppDefaultKey
} from '$lib/types/index.js';
import {optionalKey} from '$lib/elasticsearch/types/params.js';

import {is_required} from '$lib/elasticsearch/types/params.utils.js';

const getParamInfo = valuesWith(
	(paramType, paramId) => ({
		paramId,
		type: paramType,
		required: is_required(paramType),
		displayText: JSON.stringify(paramType, null, 2)
	})
);

export const getParamsInfo = _.pipe([
	getParamInfo,
	_.filterWith(_.not(_.pipe([
		_.getKey('paramId'),
		makeIsIncluded([nativeKey, shapeKey, optionalKey, defaultKey, isAppDefaultKey])
	]))),
	_.sortWith([_.not(_.getKey('required'))])
]);

export const mergeDocs = (partialParamsInfo, docs) =>
	partialParamsInfo.map(makeMergeAppliedFnMap({
		documentation: param => docs[param.paramId]
	}));
