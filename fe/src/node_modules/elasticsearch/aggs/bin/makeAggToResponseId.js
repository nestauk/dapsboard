#!/usr/bin/env node -r esm
/* eslint-disable node/shebang */

import {resolve} from 'path';

import {tapMessage} from '@svizzle/dev';
import {writeFile} from '@svizzle/file';
import {dump} from 'js-yaml';
import * as _ from 'lamb';

import * as aggs from '../index';

const PATH = resolve(__dirname, '../ref/aggToResponseType.yaml')
const makeMap = _.mapValuesWith(_.getPath('response.id'));

const mapStr = dump(makeMap(aggs));

writeFile(PATH, mapStr)
.then(tapMessage(`Saved ${PATH}`))
.catch(err => console.error(err));
