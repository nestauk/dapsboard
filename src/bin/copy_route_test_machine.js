// eslint-disable-next-line node/no-extraneous-import
import { stringifyObj } from 'svizzle/utils/obj-string'
import { testerConfig, testerOptions } from 'app/machines/builder/tester.config';
// eslint-disable-next-line node/no-unpublished-import
import clip from 'clipboardy';


clip.write(`Machine(${JSON.stringify(testerConfig, null, 2)}, ${stringifyObj(testerOptions)})`);
