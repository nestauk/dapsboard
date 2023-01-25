import { createMachina } from '../utils.js';

import { formEditingOptions } from './formediting.options.js';
import { docsOptions } from './docs.options.js';
import { historyOptions } from './history.options.js';
import { routeConfig } from './route.config.js';
import { createFormEditingStores } from './formediting.context.js';

export const options = {
	actions: {
		...formEditingOptions.actions,
		...docsOptions.actions,
		...historyOptions.actions,
	},
	guards: {
		...formEditingOptions.guards,
		...docsOptions.guards,
		...historyOptions.guards,
	}
};

export const createBuilderMachine = () => createMachina(
	routeConfig,
	options,
	createFormEditingStores()
);
