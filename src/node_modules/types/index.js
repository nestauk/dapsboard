import * as _ from 'lamb';
import {
	containsOneOf,
	isKeyValue,
	isNotNil,
	makeIsIncluded,
	mergeObj,
} from '@svizzle/utils';

// default values
export const defaultKey = '__default';
export const isAppDefaultKey = '__isAppDefault';

export const makeKeyValueObj = (key, value) => isNotNil(value)
	? {[key]: value}
	: {};

/* types */

export const nativeKey = '__native';
export const shapeKey = '__shape';

export const native = str => (defaultValue, isAppDefault) => ({
	...makeKeyValueObj(defaultKey, defaultValue),
	...makeKeyValueObj(isAppDefaultKey, isAppDefault),
	[nativeKey]: str,
});
export const isNativeKey = id => isKeyValue([nativeKey, id]);
export const getNative = _.getKey(nativeKey);

export const shape = str => (defaultValue, isAppDefault) => ({
	...makeKeyValueObj(defaultKey, defaultValue),
	...makeKeyValueObj(isAppDefaultKey, isAppDefault),
	[shapeKey]: str,
});
export const isShapeKey = id => isKeyValue([shapeKey, id]);
export const getShape = _.getKey(shapeKey);

// native
export const booleanKey = 'boolean';
export const booleanD = native(booleanKey);
export const is_boolean = isNativeKey(booleanKey);

export const floatKey = 'float';
export const floatD = native(floatKey);

export const integerKey = 'integer';
export const integerD = native(integerKey);

export const stringKey = 'string';
export const stringD = native(stringKey);

export const boolean = booleanD();
export const float = floatD();
export const integer = integerD();
export const string = stringD();

// any

const anyKey = 'any'
export const any = shape(anyKey)();

// array
const arrayKey = 'array'
export const arrayD = shape(arrayKey);
export const array = arrayD();
export const arrayOf = (itemsType, defaultValue, isAppDefault) => ({
	...makeKeyValueObj(defaultKey, defaultValue),
	...makeKeyValueObj(isAppDefaultKey, isAppDefault),
	...array,
	itemsType,
});
export const is_array = isShapeKey(arrayKey);
export const getItemsType = _.getKey('itemsType');

// pair
export const pairD = shape('pair');
export const pair = pairD();
export const pairOf = (...[type0, type1]) => ({
	...pair,
	type0,
	type1
});

// enums
const enumsKey = 'enums';
export const enumsD = shape(enumsKey);
export const enums = enumsD();
export const enumsOf = (values, defaultValue, isAppDefault) => ({
	...makeKeyValueObj(defaultKey, defaultValue),
	...makeKeyValueObj(isAppDefaultKey, isAppDefault),
	...enums,
	values,
});
export const is_enums = isShapeKey(enumsKey);
export const enumsForKeysOf = _.pipe([
	_.keys,
	type => enumsOf(type, type[0], true)
]);

// object
const objectKey = 'object';
export const objectD = shape(objectKey);
export const object = objectD();
export const objectOf = mergeObj(object);
export const is_object = isShapeKey(objectKey);

// array of objects
export const arrayOfObjects = arrayOf(object);

// xor
const xorKey = 'xor';
export const xorD = shape(xorKey);
export const xor = xorD();
// export const xorOf = mergeObj(xor);
export const xorOf = obj => ({
	__selection: enumsForKeysOf(obj),
	...obj,
	...xor
});
export const is_xor = isShapeKey(xorKey);

// some
const someKey = 'some';
export const someD = shape(someKey);
export const some = someD();
export const someOf = mergeObj(some);

// union
const unionKey = 'union';
export const unionD = shape(unionKey);
export const union = unionD();
export const unionOf = (...types) => ({types, ...union});
export const is_union = isShapeKey(unionKey);

// number
export const number = unionOf(integer, float);
export const is_number = _.pipe([
	getNative,
	makeIsIncluded([floatKey, integerKey])
]);

// extent
const extentKey = 'extent';
export const extentD = shape(extentKey);
export const extent = {
	...extentD(),
	min: number,
	max: number,
};
export const extentOf = (fieldType, defaultValue, isAppDefault) => ({
	...makeKeyValueObj(defaultKey, defaultValue),
	...makeKeyValueObj(isAppDefaultKey, isAppDefault),
	[shapeKey]: extentKey,
	min: fieldType,
	max: fieldType,
});
export const is_extent = isShapeKey(extentKey);

// record
export const record = shape('record')();
export const recordLike = ({keys, values}) => ({
	...record,
	values,
	keys: keys && enumsOf(keys) || string,
});

// intWithUnit
export const intWithUnitKey = 'intWithUnit';
export const intWithUnitD = shape(intWithUnitKey);
export const intWithUnitOf = (units, defaultUnit) => ({
	...intWithUnitD(),
	value: integerD(1),
	unit: enumsOf(units, defaultUnit)
});
export const is_intWithUnit = isShapeKey(intWithUnitKey);

// intWithinExtent
export const intWithinExtent = {
	...shape('intWithinExtent')(),
	...integer,
	min: integer,
	max: integer,
};
export const intWithin = ([min, max], defaultValue, isAppDefault) => ({
	...makeKeyValueObj(defaultKey, defaultValue),
	...makeKeyValueObj(isAppDefaultKey, isAppDefault),
	...intWithinExtent,
	min,
	max,
});

// numberWithinExtent
export const numberWithinExtent = {
	...shape('numberWithinExtent')(),
	...number,
	min: number,
	max: number,
};
export const numberWithin = ([min, max], defaultValue, isAppDefault) => ({
	...makeKeyValueObj(defaultKey, defaultValue),
	...makeKeyValueObj(isAppDefaultKey, isAppDefault),
	...numberWithinExtent,
	min,
	max,
});

// numString (parses as a number)
export const numString = shape('numString')();
export const numStringOf = stringValue => ({
	...numString,
	stringValue,
});

/* utils */

export const hasShape = _.hasKey(shapeKey);
export const hasNoShape = _.not(hasShape);

export const hasNative = _.hasKey(nativeKey);
export const hasNoNative = _.not(hasNative);

export const isShape = _.allOf([hasShape, hasNoNative]);
export const isShapeWithNative = _.allOf([hasShape, hasNative]);
export const isNative = _.allOf([hasNative, hasNoShape]);
export const isTyped = _.anyOf([hasShape, hasNative]);
export const notTyped = _.not(isTyped);

export const hasDefault = _.hasKey(defaultKey);
export const hasNoDefault = _.not(hasDefault);
export const hasESdefault =
	obj => isNotNil(obj[defaultKey]) && !obj.__isAppDefault;

export const getDefault = _.getKey(defaultKey);

export const isLabelOf = _.pipe([
	_.list,
	_.pluck(nativeKey),
	_.apply(containsOneOf)
]);

const isNumberLabel = isLabelOf(integer, float);

// arg: type key
export const numberOrString = fieldTypeKey =>
	native(isNumberLabel(fieldTypeKey) ? fieldTypeKey : 'string')();

// arg: type
export const numberOrString2 = fieldType =>
	is_number(fieldType) && number || string;

export const objectifyValues = _.mapValuesWith(_.when(notTyped, objectOf));

export const getNativeKey = _.getKey(nativeKey);
