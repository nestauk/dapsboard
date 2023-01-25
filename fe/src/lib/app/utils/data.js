import * as _ from 'lamb';
import {isKeyValue} from '@svizzle/utils';

import DATASETS from '$lib/app/data/datasets.json';
import {getApiVersion, getDatasetIdOf, getSchema} from '$lib/utils/specs';

export const findDatasetById = id => DATASETS.find(isKeyValue(['id', id]));
export const getDatasetOf = _.pipe([getDatasetIdOf, findDatasetById]);
export const getSchemaOf = _.pipe([getDatasetOf, getSchema]);
export const getApiVersionOf = _.pipe([getDatasetOf, getApiVersion]);