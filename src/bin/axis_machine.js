import { builder_config } from '../machines/builder_route/builder.config';
// eslint-disable-next-line node/no-unpublished-import
import clip from 'clipboardy';

clip.write(`Machine(${JSON.stringify(builder_config, null, 2)})`);
