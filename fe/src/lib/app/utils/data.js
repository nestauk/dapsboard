import * as _ from 'lamb';
import {isKeyValue} from '@svizzle/utils';

import DATASETS from '../data/datasets.json' assert {type: 'json'};
import {getApiVersion, getDatasetIdOf, getSchema} from '../../utils/specs.js';

export const findDatasetById = id => DATASETS.find(isKeyValue(['id', id]));
export const getDatasetOf = _.pipe([getDatasetIdOf, findDatasetById]);
export const getSchemaOf = _.pipe([getDatasetOf, getSchema]);
export const getApiVersionOf = _.pipe([getDatasetOf, getApiVersion]);
