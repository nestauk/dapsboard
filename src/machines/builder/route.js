// eslint-disable-next-line node/no-unpublished-import
import { Machine } from 'xstate';

import { configurationConfig } from './formconfig.config';
import { selectionConfig } from './form.config';
import { messageConfig } from './message.config';

export const routeConfig = {
	id: 'Route',
	initial: 'Loading',
	on: {
		ROUTE_CHANGED: {
			target: 'Route.Navigating'
		}
	},
	states: {
		Loading: {
			on: {
				READY: {
					target: 'Interactive',
					actions: ['parseParams']
				}
			}
		},
		Navigating: {
			on: {
				NAVIGATED: {
					target: 'Interactive',
					actions: ['parseParams']
				}
			}
		},
		Interactive: {
			type: 'parallel',
			states: {
				FormConfig: configurationConfig,
				FieldDocs: messageConfig,
				AggDocs: messageConfig,
				Form: selectionConfig,
			}
		}
	}
};

export const routeOptions = {
	actions: {
		...configurationConfig.actions,
		...selectionConfig.actions
	},
	guards: {
		...configurationConfig.guards,
		...selectionConfig.guards
	}
};

export const BuilderMachine = Machine(routeConfig, routeOptions);
