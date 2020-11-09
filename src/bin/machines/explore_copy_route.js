import clip from 'clipboardy';
import {stringify} from '@svizzle/utils';

// eslint-disable-next-line node/no-extraneous-import
import {stringifyObj} from 'svizzle/utils/obj-string';

import {exploreConfig} from 'app/machines/explore/route.config';
import {exploreOptions} from 'app/machines/explore/route';

clip.write(`Machine(${stringify(exploreConfig)}, ${stringifyObj(exploreOptions)})`);
console.log('/explore route copied to the clipboard\n');

// see https://xstate.js.org/viz/?gist=972d49cd6a94ea17938e67390c8dd6af
