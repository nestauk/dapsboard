import clip from 'clipboardy';
import {stringify} from '@svizzle/utils';

import {stringifyObj} from '../../utils/svizzle/utils/obj-string';

import {builderTesterConfig} from '../../lib/app/machines/builder/tester.config';
import {builderTesterOptions} from '../../lib/app/machines/builder/tester.options';

clip.write(`Machine(${stringify(builderTesterConfig)}, ${stringifyObj(builderTesterOptions)})`);
console.log('/builder route copied to the clipboard\n');

// see https://xstate.js.org/viz/?gist=b2abeff6fdff27087c8e2c5ad75d83f0
