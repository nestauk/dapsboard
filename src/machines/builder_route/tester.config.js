// eslint-disable-next-line node/no-unpublished-import
import { Machine, assign } from 'xstate';

import { configuration_config } from './configuration.config';
import { configuration_options } from './configuration.options';
import { editor_options } from './editor.options';
import { editor_config } from './editor.config';

const tester_context = {
	autoExecute: false,
	axisComplete: false,
	queryReady: false,
	matching: false,
	cached: false
};

const tester_options = {
	guards: {
		...configuration_options.guards,
		...editor_options.guards,
		"isAxisComplete": ctx => ctx.axisComplete,
		"isQueryReady": ctx => ctx.queryReady,
		"isMatching": ctx => ctx.matching,
		"isAutoExecute": ctx => ctx.autoExecute,
		"isInCache": ctx => ctx.cached,
	},
	actions: {
		...configuration_options.actions,
		...editor_options.actions,
		"toggleAxisComplete": assign({
			axisComplete: ctx => !ctx.axisComplete
		}),
		"toggleQueryReady": assign({
			queryReady: ctx => !ctx.queryReady
		}),
		"toggleMatching": assign({
			matching: ctx => !ctx.matching
		}),
		"toggleAutoExecute": assign({
			autoExecute: ctx => !ctx.autoExecute
		}),
		"toggleCached": assign({
			cached: ctx => !ctx.cached
		})
	}
};

export const tester_config = {
	id: "Builder",
	type: "parallel",
	context: tester_context,
	states: {
		"Testing": {
			initial: "Idle",
			states: {
				"Idle": {
					on: {
						"AXIS_COMPLETE_TOGGLED": {
							target: "Idle",
							actions: "toggleAxisComplete"
						},
						"QUERY_READY_TOGGLED": {
							target: "Idle",
							actions: "toggleQueryReady"
						},
						"MATCHING_TOGGLED": {
							target: "Idle",
							actions: "toggleMatching"
						},
						"CACHED_TOGGLED": {
							target: "Idle",
							actions: "toggleCached"
						}
					}
				}
			}
		},
		Configurable: configuration_config,
		Editable: editor_config,
	},
};

export const screen_machine = Machine(tester_config, tester_options);
