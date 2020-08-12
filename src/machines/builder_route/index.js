// eslint-disable-next-line node/no-unpublished-import
import { Machine } from 'xstate';

import { configurationConfig } from './configuration.config';
import { configurationOptions } from './configuration.options';
import { editorOptions } from './editor.options';
import { editorConfig } from './editor.config';


export const builderOptions = {
	actions: {
		...configurationOptions.actions,
		...editorOptions.actions
	},
	guards: {
		...configurationOptions.guards,
		...editorOptions.guards
	}
};

export const builderConfig = {
	id: 'Builder',
	type: 'parallel',
	states: {
		Config: configurationConfig,
		Editor: editorConfig
	}
};

export const BuilderMachine = Machine(builderConfig, builderOptions);
