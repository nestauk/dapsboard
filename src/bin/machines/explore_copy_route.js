import clip from 'clipboardy';
import {stringify} from '@svizzle/utils';

import {exploreConfig} from 'app/machines/explore/route.config';
import {exploreOptions} from 'app/machines/explore/route';
import {stringifyObj} from 'svizzle/utils/obj-string';

// eslint-disable-next-line no-empty-function
clip.write(`Machine(${stringify(exploreConfig)}, ${stringifyObj(exploreOptions, () => {})})`);
console.log('/explore route copied to the clipboard\n');

// see https://xstate.js.org/viz/?gist=972d49cd6a94ea17938e67390c8dd6af
