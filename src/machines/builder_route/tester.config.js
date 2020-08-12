// eslint-disable-next-line node/no-unpublished-import
import { Machine, assign } from 'xstate';

import { configurationConfig } from './configuration.config';
import { configurationOptions } from './configuration.options';
import { editorOptions } from './editor.options';
import { editorConfig } from './editor.config';

const tester_context = {
	autoExecute: false,
	axisComplete: false,
	matching: false,
	cached: false,
	queryReady: false
};

export const testerOptions = {
	actions: {
		...configurationOptions.actions,
		...editorOptions.actions,
		toggleAutoExecute: assign({
			autoExecute: ctx => !ctx.autoExecute
		}),
		toggleAxisComplete: assign({
			axisComplete: ctx => !ctx.axisComplete
		}),
		toggleCached: assign({
			cached: ctx => !ctx.cached
		}),
		toggleMatching: assign({
			matching: ctx => !ctx.matching
		}),
		toggleQueryReady: assign({
			queryReady: ctx => !ctx.queryReady
		})
	},
	guards: {
		...configurationOptions.guards,
		...editorOptions.guards,
		isAutoExecute: ctx => ctx.autoExecute,
		isAxisComplete: ctx => ctx.axisComplete,
		isInCache: ctx => ctx.cached,
		isMatching: ctx => ctx.matching,
		isQueryReady: ctx => ctx.queryReady
	}
};

export const testerConfig = {
	id: "Builder",
	type: "parallel",
	context: tester_context,
	states: {
		Testing: {
			initial: "Idle",
			states: {
				Idle: {
					on: {
						AXIS_COMPLETE_TOGGLED: {
							target: "Idle",
							actions: "toggleAxisComplete"
						},
						QUERY_READY_TOGGLED: {
							target: "Idle",
							actions: "toggleQueryReady"
						},
						MATCHING_TOGGLED: {
							target: "Idle",
							actions: "toggleMatching"
						},
						CACHED_TOGGLED: {
							target: "Idle",
							actions: "toggleCached"
						}
					}
				}
			}
		},
		Config: configurationConfig,
		Editor: editorConfig
	}
};

export const BuilderTestMachine = Machine(testerConfig, testerOptions);
