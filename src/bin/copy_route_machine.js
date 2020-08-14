import { routeConfig } from '../machines/builder/route.js';
// eslint-disable-next-line node/no-unpublished-import
import clip from 'clipboardy';

clip.write(`Machine(${JSON.stringify(routeConfig, null, 2)})`);
