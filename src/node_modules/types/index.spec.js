import assert from 'assert';

import {
	arrayD,
	arrayOf,
	boolean,
	booleanD,
	float,
	shapeKey,
	string,
	stringD,
	nativeKey,
} from 'types';

describe('elasticsearch/types/genericTypes', function () {

	describe('boolean', function () {
		it('No default', function () {
			const actual = boolean;
			const expected = {
				[nativeKey]: 'boolean',
			};
			assert.deepStrictEqual(actual, expected);
		});
		it('ES falsy default', function () {
			const actual = booleanD(false);
			const expected = {
				__default: false,
				[nativeKey]: 'boolean',
			};
			assert.deepStrictEqual(actual, expected);
		});
		it('ES truthy default', function () {
			const actual = booleanD(true);
			const expected = {
				__default: true,
				[nativeKey]: 'boolean',
			};
			assert.deepStrictEqual(actual, expected);
		});
		it('App falsy default', function () {
			const actual = booleanD(false, true);
			const expected = {
				__default: false,
				__isAppDefault: true,
				[nativeKey]: 'boolean',
			};
			assert.deepStrictEqual(actual, expected);
		});
		it('App truthy default', function () {
			const actual = booleanD(true, true);
			const expected = {
				__default: true,
				__isAppDefault: true,
				[nativeKey]: 'boolean',
			};
			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('string', function () {
		it('No default', function () {
			const actual = string;
			const expected = {
				[nativeKey]: 'string',
			};
			assert.deepStrictEqual(actual, expected);
		});
		it('ES falsy default', function () {
			const actual = stringD('');
			const expected = {
				__default: '',
				[nativeKey]: 'string',
			};
			assert.deepStrictEqual(actual, expected);
		});
		it('ES truthy default', function () {
			const actual = stringD('foo');
			const expected = {
				__default: 'foo',
				[nativeKey]: 'string',
			};
			assert.deepStrictEqual(actual, expected);
		});
		it('App falsy default', function () {
			const actual = stringD('', true);
			const expected = {
				__default: '',
				__isAppDefault: true,
				[nativeKey]: 'string',
			};
			assert.deepStrictEqual(actual, expected);
		});
		it('App truthy default', function () {
			const actual = stringD('foo', true);
			const expected = {
				__default: 'foo',
				__isAppDefault: true,
				[nativeKey]: 'string',
			};
			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('arrayD', function () {
		it('No default', function () {
			const actual = arrayD();
			const expected = {
				[shapeKey]: 'array',
			};
			assert.deepStrictEqual(actual, expected);
		});
		it('ES falsy default', function () {
			const actual = arrayD([]);
			const expected = {
				__default: [],
				[shapeKey]: 'array',
			};
			assert.deepStrictEqual(actual, expected);
		});
		it('ES truthy default', function () {
			const actual = arrayD([1, 2, 3]);
			const expected = {
				__default: [1, 2, 3],
				[shapeKey]: 'array',
			};
			assert.deepStrictEqual(actual, expected);
		});
		it('App falsy default', function () {
			const actual = arrayD([], true);
			const expected = {
				__default: [],
				__isAppDefault: true,
				[shapeKey]: 'array',
			};
			assert.deepStrictEqual(actual, expected);
		});
		it('App truthy default', function () {
			const actual = arrayD([1, 2, 3], true);
			const expected = {
				__default: [1, 2, 3],
				__isAppDefault: true,
				[shapeKey]: 'array',
			};
			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('arrayOf', function () {
		it('passing a type with no default - boolean', function () {
			const actual = arrayOf(boolean);
			const expected = {
				[shapeKey]: 'array',
				itemsType: boolean
			};
			assert.deepStrictEqual(actual, expected);
		});
		it('passing a type with ES falsy default - booleanD', function () {
			const actual = arrayOf(booleanD(false));
			const expected = {
				[shapeKey]: 'array',
				itemsType: {
					__default: false,
					[nativeKey]: 'boolean',
				}
			};
			assert.deepStrictEqual(actual, expected);
		});
		it('passing a type with ES truthy default - booleanD', function () {
			const actual = arrayOf(booleanD(true));
			const expected = {
				[shapeKey]: 'array',
				itemsType: {
					__default: true,
					[nativeKey]: 'boolean',
				}
			};
			assert.deepStrictEqual(actual, expected);
		});
		it('passing a type with ES falsy default - arrayD', function () {
			const actual = arrayOf(arrayD([]));
			const expected = {
				[shapeKey]: 'array',
				itemsType: {
					__default: [],
					[shapeKey]: 'array',
				}
			};
			assert.deepStrictEqual(actual, expected);
		});
		it('passing a type with ES truthy default - arrayD', function () {
			const actual = arrayOf(arrayD([1, 2, 3]));
			const expected = {
				[shapeKey]: 'array',
				itemsType: {
					__default: [1, 2, 3],
					[shapeKey]: 'array',
				}
			};
			assert.deepStrictEqual(actual, expected);
		});
		it('passing a type with App falsy default - boolean', function () {
			const actual = arrayOf(booleanD(false, true));
			const expected = {
				[shapeKey]: 'array',
				itemsType: {
					__default: false,
					__isAppDefault: true,
					[nativeKey]: 'boolean',
				}
			};
			assert.deepStrictEqual(actual, expected);
		});
		it('passing a type with App truthy default - boolean', function () {
			const actual = arrayOf(booleanD(true, true));
			const expected = {
				[shapeKey]: 'array',
				itemsType: {
					__default: true,
					__isAppDefault: true,
					[nativeKey]: 'boolean',
				}
			};
			assert.deepStrictEqual(actual, expected);
		});
		it('passing a type with App falsy default - arrayD', function () {
			const actual = arrayOf(arrayD([], true));
			const expected = {
				[shapeKey]: 'array',
				itemsType: {
					__default: [],
					__isAppDefault: true,
					[shapeKey]: 'array',
				}
			};
			assert.deepStrictEqual(actual, expected);
		});
		it('passing a type with App truthy default - arrayD', function () {
			const actual = arrayOf(arrayD([1, 2, 3], true));
			const expected = {
				[shapeKey]: 'array',
				itemsType: {
					__default: [1, 2, 3],
					__isAppDefault: true,
					[shapeKey]: 'array',
				}
			};
			assert.deepStrictEqual(actual, expected);
		});
		it('passing an ES default', function () {
			const actual = arrayOf(float, [1, 2, 3, 4.5]);
			const expected = {
				__default: [1, 2, 3, 4.5],
				[shapeKey]: 'array',
				itemsType: float
			};
			assert.deepStrictEqual(actual, expected);
		});
		it('passing an App default', function () {
			const actual = arrayOf(float, [1, 2, 3, 4.5], true);
			const expected = {
				__default: [1, 2, 3, 4.5],
				__isAppDefault: true,
				[shapeKey]: 'array',
				itemsType: float
			};
			assert.deepStrictEqual(actual, expected);
		});
		it('passing a type with an ES falsy default with a type with ES falsy default - arrayD', function () {
			const actual = arrayOf(arrayD([]), []);
			const expected = {
				[shapeKey]: 'array',
				__default: [],
				itemsType: {
					__default: [],
					[shapeKey]: 'array',
				}
			};
			assert.deepStrictEqual(actual, expected);
		});

		/* Note: no items type enforcement!! */
		it('passing a type with an ES falsy default with a type with ES truthy default - arrayD (array items type not specified)', function () {
			const actual1 = arrayOf(arrayD([]), [1, 2, 3]);
			const expected1 = {
				[shapeKey]: 'array',
				__default: [1, 2, 3],
				itemsType: {
					__default: [],
					[shapeKey]: 'array',
				}
			};
			assert.deepStrictEqual(actual1, expected1);

			const actual2 = arrayOf(arrayD([]), ['a', 'b', 'c']);
			const expected2 = {
				[shapeKey]: 'array',
				__default: ['a', 'b', 'c'],
				itemsType: {
					__default: [],
					[shapeKey]: 'array',
				}
			};
			assert.deepStrictEqual(actual2, expected2);
		});
		it('passing a type with an ES truthy default with a type with ES falsy default - arrayD', function () {
			const actual = arrayOf(arrayD([1, 2, 3]), []);
			const expected = {
				[shapeKey]: 'array',
				__default: [],
				itemsType: {
					__default: [1, 2, 3],
					[shapeKey]: 'array',
				}
			};
			assert.deepStrictEqual(actual, expected);
		});

		/* Note: no items type enforcement!! */
		it('passing a type with an ES truthy default with a type with ES truthy default - arrayD (array items type not specified)', function () {
			const actual1 = arrayOf(arrayD([1, 2, 3]), [1, 2, 3]);
			const expected1 = {
				[shapeKey]: 'array',
				__default: [1, 2, 3],
				itemsType: {
					__default: [1, 2, 3],
					[shapeKey]: 'array',
				}
			};
			assert.deepStrictEqual(actual1, expected1);

			const actual2 = arrayOf(arrayD([1, 2, 3]), ['a', 'b', 'c']);
			const expected2 = {
				[shapeKey]: 'array',
				__default: ['a', 'b', 'c'],
				itemsType: {
					__default: [1, 2, 3],
					[shapeKey]: 'array',
				}
			};
			assert.deepStrictEqual(actual2, expected2);
		});
	});
});
