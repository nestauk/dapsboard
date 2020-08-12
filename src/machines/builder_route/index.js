// eslint-disable-next-line node/no-unpublished-import
import { Machine } from 'xstate';

import { configurationConfig } from './configuration.config';
import { selectionConfig } from './selection.config';


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
	initial: 'Loading',
	states: {
		Loading: {
			on: {
				READY: {
					target: "Interactive",
					actions: ['parseParams']
				}
			}
		},
		Navigating: {
			on: {
				NAVIGATED: {
					target: "Interactive",
					actions: ['parseParams']
				}
			}
		},
		Interactive: {
			type: 'parallel',
			states: {
				Configuring: configurationConfig,
				Selecting: selectionConfig,
			}
		}
	}
};

export const BuilderMachine = Machine(builderConfig, builderOptions);
