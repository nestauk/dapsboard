import { createMachina } from '../utils';

import { formEditingOptions } from './formediting.options';
import { docsOptions } from './docs.options';
import { historyOptions } from './history.options';
import { routeConfig } from './route.config';
import { createFormEditingStores } from './formediting.context';

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
