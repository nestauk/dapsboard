import { formEditingConfig } from './formediting.config.js';
import { docsConfig } from './docs.config.js';
import { historyConfig } from './history.config.js';

export const routeConfig = {
	id: 'BuilderRoute',
	initial: 'Loading',
	states: {
		Loading: {
			on: {
				READY: {
					target: '#BuilderRoute.Interactive',
					actions: [
						'resetForms',
					]
				}
			}
		},
		Interactive: {
			type: 'parallel',
			states: {
				Docs: docsConfig,
				FormEditing: formEditingConfig,
				History: historyConfig,
			},
			on: {
				ROUTE_CHANGED: {
					target: '#BuilderRoute.Interactive',
					actions: [
						'resetForms',
					]
				}
			}
		}
	}
};
