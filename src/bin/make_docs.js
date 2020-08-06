#!/usr/bin/env node -r esm

/* eslint-disable
	node/no-unpublished-import,
	node/shebang
*/

import path from 'path';
import * as _ from 'lamb';
import {readJson, saveObj} from '@svizzle/file';
import {isKeyValue} from '@svizzle/utils';

const DOCS_PATH = path.resolve(__dirname, '../node_modules/app/data/agg_docs.json');

const PATH = path.resolve(__dirname, '../node_modules/app/data/typedoc_out.json');
const lookup = _.pipe([
	_.getPath('children.0.children'),
	_.filterWith(_.anyOf([
		isKeyValue(['name', 'MetricAggregations']),
		isKeyValue(['name', 'BucketAggregations']),
	])),
	_.flatMapWith(_.pipe([
		_.getPath('type.declaration.children'),
		_.mapWith(_.collect([
			_.getKey('name'),
			_.getPath('comment.shortText'),
		])),
	])),
	_.fromPairs,
]);

readJson(PATH, 'utf-8')
.then(lookup)
.then(saveObj(DOCS_PATH, 2));
