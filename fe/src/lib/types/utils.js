import * as _ from 'lamb';

import {occursWith} from '$lib/utils/svizzle/utils/[any-boolean]-[array-boolean].js';
import {ψ} from '$lib/utils/svizzle/utils/array-[any-any].js';

import {
	getNative,
	getShape,
	is_union,
	isNative,
	isShape,
	isShapeWithNative,
} from './index.js';

export const isSameType = type => _.anyOf([
	_.allOf([
		isNative,
		ψ(getNative, _.is(getNative(type)))
	]),
	_.allOf([
		isShape,
		ψ(getShape, _.is(getShape(type)))
	]),
	_.allOf([
		isShapeWithNative,
		ψ(getShape, _.is(getShape(type))),
		ψ(getNative, _.is(getNative(type)))
	])
]);

export const makeIsTypeInUnion = type =>
	ψ(_.getKey('types'), occursWith(isSameType(type)));

export const makeIsTypeCompatibleWithType = type => _.anyOf([
	isSameType(type),
	_.allOf([is_union, makeIsTypeInUnion(type)])
]);
