// eslint-disable-next-line node/no-unpublished-import
import { Machine } from 'xstate';

import { configuration_config } from './configuration.config';
import { configuration_options } from './configuration.options';
import { editor_options } from './editor.options';
import { editor_config } from './editor.config';


export const builder_route_options = {
	guards: {
		...configuration_options.guards,
		...editor_options.guards
	},
	actions: {
		...configuration_options.actions,
		...editor_options.actions
	}
};

export const builder_route_config = {
	id: 'Builder',
	type: 'parallel',
	states: {
		Configurable: configuration_config,
		Editable: editor_config,
	},
};

export const screen_machine = Machine(builder_route_config, builder_route_options);
