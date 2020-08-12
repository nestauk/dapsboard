import { tester_config } from '../machines/builder_route/tester.config';
// eslint-disable-next-line node/no-unpublished-import
import clip from 'clipboardy';

clip.write(`Machine(${JSON.stringify(tester_config, null, 2)})`);
