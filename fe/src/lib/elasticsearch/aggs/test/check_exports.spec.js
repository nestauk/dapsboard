import assert from 'node:assert';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import * as _ from 'lamb';
import {readDir, readFile} from '@svizzle/file';
import {
	isIterableNotEmpty,
	makeEndsWith,
	makePrefixed,
	makeStartsWith,
	sliceStringAt,
} from '@svizzle/utils';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const INDEX_PATH = path.resolve(__dirname, '../index.js');
const SRC_DIR_PATH = path.resolve(__dirname, '../');
const REGEX = /export \{default as .*\} from '\.\/(.*)';\n/ug;

const isAggModule = _.allOf([
	makeEndsWith('.js'),
	_.not(makeStartsWith('_')),
	_.not(makeStartsWith('index')),
	_.not(makeEndsWith('.todo.js')),
	_.not(makeEndsWith('.spec.js')),
]);

describe('elasticsearch/aggs: exports', function () {
	it('All agg valid modules are exported', async function () {
		const leftovers = await Promise.all([
			readDir(SRC_DIR_PATH).then(_.pipe([
				_.filterWith(isAggModule),
				_.mapWith(sliceStringAt([0, -3])),
				_.sortWith([])
			])),

			readFile(INDEX_PATH, 'utf-8')
			.then(srcIndex => [...srcIndex.matchAll(REGEX)].map(_.getAt(1)))
			.then(_.sortWith([])),
		])
		.then(([modules, exported]) => _.pullFrom(modules, exported))
		.catch(err => console.error(err));

		const gotDupes = isIterableNotEmpty(leftovers);
		if (gotDupes) {
			const list = leftovers.map(makePrefixed('- ')).join('\n');
			console.log(`\n======================\n✋`)
			console.log(`elasticsearch/aggs/index.js not exporting modules with these filenames:\n\n${list}`)
			console.log(`======================\n`)
		}

		assert.deepStrictEqual(gotDupes, false);
	});
});
