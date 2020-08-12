import { builder_route_config } from '../machines/builder_route';
// eslint-disable-next-line node/no-unpublished-import
import clip from 'clipboardy';

clip.write(`Machine(${JSON.stringify(builder_route_config, null, 2)})`);
