import assert from 'assert';

import {optional} from '$lib/elasticsearch/types/params';
import {integer, integerD} from '$lib/types';

import {aggHasNoRequiredParamsWithoutDefault} from './aggs.utils';

describe('elasticsearch/types/aggs.utils', function () {
	describe('aggHasNoRequiredParamsWithoutDefault', function () {
		it('only requireds with default', function () {
			const actual = aggHasNoRequiredParamsWithoutDefault({
				opt: optional(integer),
				reqD: integerD(10),
			});

			assert.deepStrictEqual(actual, true);
		});
		it('requireds without default', function () {
			const actual = aggHasNoRequiredParamsWithoutDefault({
				opt: optional(integer),
				reqD: integerD(10),
				reqNoD: integer,
			});

			assert.deepStrictEqual(actual, false);
		});
	});
});
