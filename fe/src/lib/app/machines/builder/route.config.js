import { formEditingConfig } from 'app/machines/builder/formediting.config';
import { docsConfig } from './docs.config';
import { historyConfig } from './history.config';

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
