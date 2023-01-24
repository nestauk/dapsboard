import assert from 'node:assert';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import {readJson} from '@svizzle/file';

import {getDatasetOf} from '../../app/utils/data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GENERAL_ARXIV_V0_PATH = path.resolve(__dirname, '../../test_assets/general_arxiv_v0.json');
const general_arxiv_v0 = await readJson(GENERAL_ARXIV_V0_PATH);


describe('utils/data.js', function () {

	describe('getDatasetOf', function () {
		it('should get the right dataset - general_arxiv_v0', function () {
			const source = 'arxiv';
			const project = 'general';
			const version = 0;

			const actual = getDatasetOf({project, source, version});
			const expected = general_arxiv_v0;

			assert.deepStrictEqual(actual, expected);
		});
	});

});
