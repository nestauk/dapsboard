// eslint-disable-next-line node/no-unpublished-import
import { Machine } from 'xstate';

import { configurationConfig } from './formconfig.config';
import { selectionConfig } from './form.config';


export const builderOptions = {
	actions: {
		...configurationConfig.actions,
		...selectionConfig.actions
	},
	guards: {
		...configurationConfig.guards,
		...selectionConfig.guards
	}
};

export const builderConfig = {
	id: 'Route',
	initial: 'Loading',
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
				Form: selectionConfig,
			}
		}
	}
};

export const BuilderMachine = Machine(builderConfig, builderOptions);
