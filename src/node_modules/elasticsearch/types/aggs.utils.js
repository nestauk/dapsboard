import * as _ from 'lamb';
import {isObjEmpty} from '@svizzle/utils';

import {hasNoDefault, nativeKey, shapeKey} from 'types';
import {is_required} from 'elasticsearch/types/params.utils';

// agg.request -> boolean
export const aggHasNoRequiredParams = _.pipe([
	_.skip([shapeKey, nativeKey, 'field']),
	_.pickIf(is_required),
	isObjEmpty
]);

// agg.request -> boolean
export const aggHasNoRequiredParamsWithoutDefault = _.pipe([
	_.skip([shapeKey, nativeKey, 'field']),
	_.pickIf(_.allOf([is_required, hasNoDefault])),
	isObjEmpty
]);
