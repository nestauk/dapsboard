import assert from 'assert';

import {
	array,
	boolean,
	booleanD,
	isNative,
	isShape,
} from '$lib/types';
import {esNumeric, esDates} from '$lib/elasticsearch/aggs/ref/typeGroups';
import {date_YYYYMMDD_dash} from '$lib/elasticsearch/types/fields';

import {
	isSameType,
	makeIsTypeInUnion,
} from './utils';

const isSameTypeAsBoolean = isSameType(boolean);

const True = booleanD(true);
const False = booleanD(false);

describe('types/utils', function () {
	describe('isNative', function () {
		it('`boolean` is native', function () {
			assert.deepStrictEqual(isNative(True), true);
		});
		it('`True` is native', function () {
			assert.deepStrictEqual(isNative(True), true);
		});
		it('`array` is not native', function () {
			assert.deepStrictEqual(isNative(array), false);
		});
	});
	describe('isShape', function () {
		it('`array` is a shape', function () {
			assert.deepStrictEqual(isShape(array), true);
		});
		it('`True` is not a shape', function () {
			assert.deepStrictEqual(isShape(True), false);
		});
	});
	describe('isSameType', function () {
		it('`boolean` is same as a boolean', function () {
			assert.deepStrictEqual(isSameTypeAsBoolean(boolean), true);
		});
		it('`True` is same as a boolean', function () {
			assert.deepStrictEqual(isSameTypeAsBoolean(True), true);
		});
		it('`False` is same as a boolean', function () {
			assert.deepStrictEqual(isSameTypeAsBoolean(False), true);
		});
	});
	describe('makeIsTypeInUnion', function () {

		it('detect shapes: `esDates` contains `date_YYYYMMDD_dash`', function () {
			const isTypeInUnion = makeIsTypeInUnion(date_YYYYMMDD_dash);

			assert.deepStrictEqual(isTypeInUnion(esDates), true);
		});
		it('detect shapes: `esDates` does not contain `boolean`', function () {
			const isTypeInUnion = makeIsTypeInUnion(boolean);

			assert.deepStrictEqual(isTypeInUnion(esDates), false);
		});
		it('detect natives: `esNumeric` contains `boolean`', function () {
			const isTypeInUnion = makeIsTypeInUnion(boolean);

			assert.deepStrictEqual(isTypeInUnion(esNumeric), true);
		});
		it('detect natives: `esDates` does not contain `boolean`', function () {
			const isTypeInUnion = makeIsTypeInUnion(boolean);
			assert.deepStrictEqual(isTypeInUnion(esDates), false);
		});
	});
});
