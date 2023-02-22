#!/usr/bin/env node

/* eslint-disable
	node/shebang
*/

import path from 'node:path';
import {fileURLToPath} from 'node:url';

import {tapMessage} from '@svizzle/dev';
import {saveExportedObj} from '@svizzle/file';
import * as _ from 'lamb';

import * as aggs from '../spec/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PATH = path.resolve(__dirname, '../ref/aggToResponseType.js');
const makeMap = _.mapValuesWith(_.getPath('response.id'));

const mapStr = makeMap(aggs);

saveExportedObj(PATH, '\t')(mapStr)
.then(tapMessage(`Saved ${PATH}`))
.catch(err => console.error(err));
