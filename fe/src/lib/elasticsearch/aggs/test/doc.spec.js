// import assert from 'assert';
// import * as _ from 'lamb';

// import {aggParamShapeByAggId} from '$lib/elasticsearch/config/aggParamShapeByAggId';
// import aggParamDocByAggId from '$lib/elasticsearch/config/aggParamDocByAggId';
// import aggsDocURL from '$lib/elasticsearch/config/aggsDocURL';
// import {evaluate} from '$lib/utils/generic';

// const getParams = _.mapWith(([key, definition]) => [key, _.keys(definition)]);

// const excludeParams = params => _.pipe([
// 	_.mapWith(([key, definition]) => [key, _.pull(params)(definition)])
// ]);

// const valuesAreIn = params => _.pipe([_.getAt(1), _.contains(params)]);
// const intersectParams = params => _.filterWith(valuesAreIn(params));
// const getAggNames = _.mapWith(_.getAt(0));

// const getTypedParams = _.pipe([
// 	_.pairs,
// 	_.mapWith(([key, definition]) => [key, evaluate('dummy')(definition)]),
// ]);

// const typedParams = getTypedParams(aggParamShapeByAggId);

// describe('elasticsearch/config.js', function () {

// 	describe('Ensure all aggregations are documented.', function () {
// 		it('should have one doc entry per aggregation', function () {
// 			const expected = getAggNames(typedParams);
// 			const actual = getAggNames(intersectParams('__docs')(
// 				getParams(_.pairs(aggParamDocByAggId))
// 			));

// 			assert.deepStrictEqual(actual, expected);
// 		});
// 	});

// 	describe('Ensure all top level aggregation parameters are documented.', function () {
// 		it('should have one doc entry per parameter', function () {
// 			const expected = excludeParams(['field'])(
// 				getParams(typedParams)
// 			);
// 			const actual = excludeParams(['__docs'])(
// 				getParams(_.pairs(aggParamDocByAggId))
// 			);

// 			assert.deepStrictEqual(actual, expected);
// 		});
// 	});

// 	describe('Ensure all aggregations have URLs to reference docs.', function () {
// 		it('should have one URL entry per aggregation', function () {
// 			const expected = _.sort(getAggNames(typedParams));
// 			const actual = _.sort(_.keys(aggsDocURL));

// 			assert.deepStrictEqual(actual, expected);
// 		});
// 	});

// });
