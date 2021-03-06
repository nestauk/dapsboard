import clip from 'clipboardy';
import {stringify} from '@svizzle/utils';

import {stringifyObj} from 'utils/svizzle/utils/obj-string';

import {formConfig} from 'app/machines/builder/form.config';
import {builderTesterOptions} from 'app/machines/builder/tester.options';

clip.write(`Machine(${stringify({
	...formConfig,
	context: {
		autoExecute: false,
		cached: false,
		hideDisabledAxes: true,
		hideDisabledAggs: false,
		hideDisabledDatasets: false,
		hideDisabledItems: true,
		matching: false,
		selectionComplete: false,
		showFullResponse: false,
		queryReady: false
	}
})}, ${stringifyObj(builderTesterOptions)})`);
console.log('/builder form copied to the clipboard\n');

// see https://xstate.js.org/viz/?gist=2c26ae02b853db5dd2e6377d123979f3
