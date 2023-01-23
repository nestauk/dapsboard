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
} from 'types';
import {optionalKey} from 'elasticsearch/types/params';

import {is_required} from 'elasticsearch/types/params.utils';

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
