// eslint-disable-next-line node/no-extraneous-import
import { stringifyObj } from 'svizzle/utils/obj-string'
import { testerConfig, testerOptions } from '../machines/builder_route/tester.config';
// eslint-disable-next-line node/no-unpublished-import
import clip from 'clipboardy';


clip.write(`Machine(${JSON.stringify(testerConfig, null, 2)}, ${stringifyObj(testerOptions)})`);
