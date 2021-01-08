import * as _ from 'lamb';
import {
	getNativeKey,
	getItemsType,
	is_array,
	is_enums,
	is_extent,
	is_intWithUnit,
	is_object,
	is_xor,
	isNative,
} from 'types'

import { getKeyOf } from 'utils/generic';

import ArrayEditor from 'app/components/elementary/ArrayEditor.svelte';
import BooleanRadios from 'app/components/elementary/BooleanRadios.svelte';
import ObjectEditor from 'app/components/elementary/ObjectEditor.svelte';
import RadioList from 'app/components/elementary/RadioList.svelte';
import SimpleField from 'app/components/elementary/SimpleField.svelte';

const typeEditors = {
	boolean: {
		component: BooleanRadios
	},
	integer: {
		component: SimpleField,
		props: {
			type: 'number',
			dataType: 'integer'
		}
	},
	float: {
		component: SimpleField,
		props: {
			type: 'number',
			dataType: 'float'
		}
	},
	keyword: {
		component: SimpleField,
		props: {
			type: 'text',
			dataType: 'keyword'
		}
	},
	text: {
		component: SimpleField,
		props: {
			type: 'text',
			dataType: 'text'
		}
	},
	textWithKeyword: {
		component: SimpleField,
		props: {
			type: 'text',
			dataType: 'textWithKeyword'
		}
	},
	string: {
		component: SimpleField,
		props: {
			type: 'text',
			dataType: 'string'
		}
	},
	date: {
		component: SimpleField,
		props: {type: 'date'}
	},
	date_YYYYMMDD_dash: {
		component: SimpleField,
		props: {
			type: 'date',
			dataType: 'date_YYYYMMDD_dash'
		}
	},
	date_YYYYMMDD_dash_time: {
		component: SimpleField,
		props: {
			type: 'date',
			dataType: 'date_YYYYMMDD_dash'
		}
	},
};

const makeEditor = component => props => ({component, props});

const arrayEditor = makeEditor(ArrayEditor);
const objectEditor = makeEditor(ObjectEditor);
const simpleEditor = makeEditor(SimpleField);
const unionEditor = makeEditor(RadioList);

const configNativeEditor = _.pipe([
	getNativeKey,
	getKeyOf(typeEditors)
])
const configEnumsEditor = type => unionEditor({
	typeObject: type.values
});
const configArrayEditor = type => arrayEditor({
	// eslint-disable-next-line no-use-before-define
	fieldEditor: getEditor(type)
});
const configArrayObjectEditor = _.pipe([
	getItemsType,
	configArrayEditor
]);
const configObjectEditor = type => objectEditor({
	typeObject: type
});
const configJsonEditor = type => simpleEditor({
	type: 'json',
	typeObject: type
});

export const getEditor = _.adapter([
	_.casus(isNative, configNativeEditor),
	_.casus(is_enums, configEnumsEditor),
	_.casus(is_array, configArrayObjectEditor),
	_.casus(is_xor, configObjectEditor),
	_.casus(is_object, configObjectEditor),
	_.casus(is_intWithUnit, configObjectEditor),
	_.casus(is_extent, configObjectEditor),
	configJsonEditor
]);
