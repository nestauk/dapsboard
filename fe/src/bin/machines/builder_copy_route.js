import clip from 'clipboardy';
import {stringify} from '@svizzle/utils';

import {stringifyObj} from '../../lib/utils/svizzle/utils/obj-string.js';

import {builderTesterConfig} from '../../lib/app/machines/builder/tester.config.js';
import {builderTesterOptions} from '../../lib/app/machines/builder/tester.options.js';

clip.write(`Machine(${stringify(builderTesterConfig)}, ${stringifyObj(builderTesterOptions)})`);
console.log('/builder route copied to the clipboard\n');

// see https://xstate.js.org/viz/?gist=b2abeff6fdff27087c8e2c5ad75d83f0
