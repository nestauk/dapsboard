import assert from 'node:assert';

import {getDatasetOf} from '../../app/utils/data.js';

import general_arxiv_v0 from '../../test_assets/general_arxiv_v0.json' assert {type: 'json'};

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
