import {stringify} from '@svizzle/utils';
import clip from 'clipboardy';

import {exploreConfig} from '$lib/app/machines/explore/route.config.js';
import {exploreOptions} from '$lib/app/machines/explore/route.js';
import {stringifyObj} from '$lib/utils/svizzle/utils/obj-string.js';

// eslint-disable-next-line no-empty-function
clip.write(`${stringify(exploreConfig)}, ${stringifyObj(exploreOptions, () => {})}`);
console.log('/explore route copied to the clipboard\n');

// see https://xstate.js.org/viz/?gist=972d49cd6a94ea17938e67390c8dd6af
