import { selectionConfig } from '../machines/builder/form.config';
// eslint-disable-next-line node/no-unpublished-import
import clip from 'clipboardy';

clip.write(`Machine(${JSON.stringify(selectionConfig, null, 2)})`);
