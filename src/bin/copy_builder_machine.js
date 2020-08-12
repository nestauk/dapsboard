import { builderConfig } from '../machines/builder_route';
// eslint-disable-next-line node/no-unpublished-import
import clip from 'clipboardy';

clip.write(`Machine(${JSON.stringify(builderConfig, null, 2)})`);
