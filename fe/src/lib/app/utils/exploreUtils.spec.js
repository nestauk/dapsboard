import assert from 'node:assert';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import {readJson} from '@svizzle/file';

import {selectionToAggsQuery} from '../../app/utils/exploreUtils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GENERAL_ARXIV_V0_PATH_DATE_CREATED_ARTICLE_PATH = path.resolve(__dirname, '../../test_assets/general_arxiv_v0_date_created_article.json');
const general_arxiv_v0_date_created_article = await readJson(GENERAL_ARXIV_V0_PATH_DATE_CREATED_ARTICLE_PATH);

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
