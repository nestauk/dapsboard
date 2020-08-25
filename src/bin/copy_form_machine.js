// eslint-disable-next-line node/no-unpublished-import
import clip from 'clipboardy';
// eslint-disable-next-line node/no-extraneous-import
import { stringifyObj } from 'svizzle/utils/obj-string'
import { formConfig } from 'app/machines/builder/form.config';
import { testerOptions } from 'app/machines/builder/tester.options';

clip.write(`Machine(${JSON.stringify({
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
}, 2)}, ${stringifyObj(testerOptions)})`);
