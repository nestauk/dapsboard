import { axis_config } from '../machines/builder_route/axis.config';
// eslint-disable-next-line node/no-unpublished-import
import clip from 'clipboardy';

clip.write(`Machine(${JSON.stringify(axis_config, null, 2)})`);
