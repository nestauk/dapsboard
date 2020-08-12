import { testerConfig, testerOptions } from '../machines/builder_route/tester.config';
// eslint-disable-next-line node/no-unpublished-import
import clip from 'clipboardy';

function stringify (obj) {
	let placeholder = '____PLACEHOLDER____';
	let fns = [];
	let json = JSON.stringify(obj, function (key, value) {
		if (typeof value === 'function') {
			fns.push(value);
			return placeholder;
		}
		return value;
	}, 2);
	json = json.replace(new RegExp(`"${placeholder}"`, 'ug'), function () {
		return fns.shift();
	});
	return json;
}

clip.write(`Machine(${JSON.stringify(testerConfig, null, 2)}, ${stringify(testerOptions)})`);
