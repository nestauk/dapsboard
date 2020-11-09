import clip from 'clipboardy';
// eslint-disable-next-line node/no-extraneous-import
import { stringifyObj } from 'svizzle/utils/obj-string'
import { testerConfig } from 'app/machines/builder/tester.config';
import { testerOptions } from 'app/machines/builder/tester.options';

clip.write(`Machine(${JSON.stringify(testerConfig, null, 2)}, ${stringifyObj(testerOptions)})`);
