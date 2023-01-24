<!-- ## Type system

The type system is currently used for generating request forms and may
eventually also be used for validation prior to sending the requests.

It draws its inspiration from many features available in Typescript offering
support for such things as type unions, generics and string literal types. It
does however offer additional support for special types useful in composing
Elasticsearch query requests.

### Types

#### Named types

Named types are defined using strings. The following 'native' types are
backed by form editor components:

* `boolean`
* Numeric types: `number`, `integer`, `float`
* Alphanumeric types: `string`, `ES_Text`, `keyword`, `ES_Text_w_keyword`
* Date types: `date`, `date_YYYYMMDD_dash`, `date_YYYYMMDD_dash_time` (time not
	presently editable)
* Object types:
	* `json`: Provides a field where JSON can be input.
	* `MinMax<NumericType>`: Invokes the display of a special component for
	  editing values of shape `{min: integer | float, max: integer | float}`.
	* `Existence`: Parameters which are either `undefined` or `{}` display a
	  single checkbox in the form.
	* `geoPointObject`: For editing lat/lon coordinates of shape
	  `{lat: float, lon: float}`.

```javascript
const someAggregationParams = {
	size: 'float', // defining a `size` request parameter if `float` type
	count: 'integer', // defining a parameter of `float` type
	name: 'string', // defining a parameter of 'string' type
	date: 'date_YYYYMMDD_dash', // Will present the user with a date editor
	someParam: 'json' // the value will be parsed as json and added to the request
}
```

#### String Literals

String literal types are strings whose first and last characters are double
quotes `"`. They're mainly used in conjunction with type unions which are
explained immediately below.

```javascript
const aStringLiteral = '"homoscedastic"';
```

#### Type unions

Sometimes a request parameter can have values of differing type. This can be
specified in the type system with a type union, which is represented by an
array of types.

```javascript
const t_test = {
	// The following specifies a parameter allowing only three possible
	// string values through a type union of three string literal types.
	type: ['"paired"', '"homoscedastic"', '"heteroscedastic"']
};
```
#### Compound types

Compound types are defined using objects.

```javascript
// A compound type with two internal properties specifying type unions
// of string literals.
const sortOptions = {
	_key: ['"asc"', '"desc"', 'undefined'],
	_count: ['"asc"', '"desc"', 'undefined']
};
```

#### Generic/dynamic types

Generic types can be specified by providing a function whose arguments are
the generic type arguments. At this time, generics is limited to a single
generic type, which is all that is needed for Elasticsearch requests.

```javascript
// A generic or dynamic type defined through a function. The evaluated type
// will depend on the value of the type.
const metricFieldParams = type => ({
	field: 'string',
	missing: [
		['integer', 'float'].includes(type)
			? type
			: 'string',
		'undefined'
	]
});
```

#### Arrays

We can specify array types in two ways:

* Arrays of named types are strings ending with `[]`.
* For types that can't be specified with single strings, arrays of these types
  can also be defined with objects having a single `__array` property whose
	value is the type of the array.

```javascript
	const percentile_ranks = {
		// an array of floats
		values: 'float[]', // could also be defined as `{__array: 'float'}`
	};
	const date_range = {
		// an array of ranges
		ranges: {
			__array: {
				key: ['string', 'undefined'],
				from: ['string', 'undefined'],
				to: ['string', 'undefined']
			}
		}
	};
```

#### Numericals with units

Numbers with units can be specified with an object having a single `__units`
property whose values is an array of strings defining the possible units that
can be used.

```javascript
// A type specifying a physical quantity and its list of allowed units.
const calendar_interval = {
	__units: ['m', 'h', 'd', 'w', 'M', 'w', 'q', 'y']
};
```

#### Record types
Record types, which essentialy allow for named lists, can be specified with an
object having a `__record` property specifying the type of the item names and a
`__type` property specifying the type of the item values. These are currently
editable as JSON fields.

```javascript
// A record allowing for arbitrary entry names of type `string` and entry values
// of type `{size: 'integer}`
// as JSON fields).
const composite = {
	sources: {
		__record: 'string',
		__type: {
			size: 'integer'
		}
	}
};
```

Sometimes, record keys may be constrained to only field names for the dataset
being operated on. Since this can only be known at runtime, a special type
`field` can be chosen for the `__record` property.

```javascript
// A record constraining entry names to be only field names of the selected
// dataset
const filter = {
	__record: 'field',
	__type: 'string[]'
};
```

#### Defining types for mutually exclusive parameters

Properties of parameters whose names start with `__` are treated as exclusive
with each other. The value of the `__type` inner property indicates which is the
actual property to include in the final request JSON.

This is useful when these fields are required, but mutually exclusive.

```javascript
const date_histogram = {
	// Only one of the following properties can be set.
	__interval: {
		__type: ['"interval"', '"calendar_interval"', '"fixed_interval"'],
		interval: {
			__units: ['ms', 's', 'm', 'h', 'd', 'w', 'M', 'q', 'y']
		},
		calendar_interval: {
			__units: ['m', 'h', 'd', 'w', 'M', 'w', 'q', 'y']
		},
		fixed_interval: {
			__units: ['ms', 's', 'm', 'h', 'd']
		}
	}
}
```

#### Alternative names

Type objects can include a `__legacyName` property to help in form generation
upstream. This will be deprecated as type detection is improved.

```javascript
const histogram = {
	// By specifying `__legacyName` we can inform the form generator to use
	// a particular editor component.
	extended_bounds: {
		__legacyName: `MinMax<${type}>`,
		min: type,
		max: type
	}
};
```

#### Optional types

Properties can be defined as optional by specifying the type in a type union
accompanied with the `undefined` type. The `null` type may also be supported at
a later time.

```javascript
// Request parameters can be specified as optional by declaring type unions
// that include the `undefined` type.
const geohash_grid = {
	precision: ['integer', 'undefined'],
	size: ['integer', 'undefined'],
	shard_size: ['integer', 'undefined']
};
```

### Editor Components

The following editor components are implemented:

* `SimpleField`: Numeric, alphanumeric, date and JSON valued fields.
* `BooleanRadios`: Boolean and optional boolean valued fields.
* `EsGeoPointObj`: The `geoPointObject` type.
* `MinMax<NumericType>`: For min/max type objects.
* `NumericalUnitsEditor`: For `{__units: [...]}` types.
* `ObjectEditor`: Compound object types.
* `RadioList`: Supports literal string unions. -->
