import assert from 'assert';

import {selectionToAggsQuery} from 'app/utils/exploreUtils';
import general_arxiv_v0_date_created_article from 'test_assets/general_arxiv_v0_date_created_article.json';

describe('utils/exploreUtils.js', function () {
	describe('selectionToAggsQuery', function () {
		it('should return all possible aggregations - single field', function () {
			const actual = selectionToAggsQuery({
				fields: ['date_created_article'],
				project: 'general',
				source: 'arxiv',
				version: 0,
			});
			const expected = general_arxiv_v0_date_created_article;

			assert.deepStrictEqual(actual, expected);
		});
	});
});
