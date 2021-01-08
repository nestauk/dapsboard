/**
* @module @svizzle/utils/[any-boolean]-[array-boolean]
*/

import * as _ from 'lamb';
import {isNotNil} from '@svizzle/utils';

import {ψ} from './array-[any-any]';

export const occursWith = predicate => ψ(_.findWhere(predicate), isNotNil);
