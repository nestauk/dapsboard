import assert from 'node:assert';

import {makeIsAggVersionCompatible} from './version.js';

describe('elasticsearch/aggs/utils/version', function () {
	describe('makeIsAggVersionCompatible', function () {
		const isCompatible = makeIsAggVersionCompatible('6.3');

		it('same `from`: OK', function () {
			assert.deepStrictEqual(isCompatible({
				availability: {from: '6.3'}
			}), true);
		});
		it('lower `from`: OK', function () {
			assert.deepStrictEqual(isCompatible({
				availability: {from: '6.1'}
			}), true);
		});
		it('higher `from`: fails', function () {
			assert.deepStrictEqual(isCompatible({
				availability: {from: '7.0'}
			}), false);
		});
		it('same `to`: OK', function () {
			assert.deepStrictEqual(isCompatible({
				availability: {from: '0.1', to: '6.3'}
			}), true);
		});
		it('higher `to`: OK', function () {
			assert.deepStrictEqual(isCompatible({
				availability: {from: '0.1', to: '6.9'}
			}), true);
		});
		it('lower `to`: fails', function () {
			assert.deepStrictEqual(isCompatible({
				availability: {from: '0.1', to: '5.4'}
			}), false);
		});
	});
});
