import clip from 'clipboardy';
import {stringify} from '@svizzle/utils';

// eslint-disable-next-line node/no-extraneous-import
import {stringifyObj} from 'svizzle/utils/obj-string';

import {builderTesterConfig} from 'app/machines/builder/tester.config';
import {builderTesterOptions} from 'app/machines/builder/tester.options';

clip.write(`Machine(${stringify(builderTesterConfig)}, ${stringifyObj(builderTesterOptions)})`);
console.log('/builder route copied to the clipboard\n');

// see https://xstate.js.org/viz/?gist=b2abeff6fdff27087c8e2c5ad75d83f0
