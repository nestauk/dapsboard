// eslint-disable-next-line node/no-unpublished-import
import { Machine, assign } from 'xstate';

import { builderConfig } from './index.js';

const tester_context = {
	autoExecute: false,
	cached: false,
	matching: false,
	selectionComplete: false,
	queryReady: false
};

export const testerOptions = {
	actions: {
		toggleAutoExecute: assign({
			autoExecute: ctx => !ctx.autoExecute
		}),
		toggleCached: assign({
			cached: ctx => !ctx.cached
		}),
		toggleMatching: assign({
			matching: ctx => !ctx.matching
		}),
		toggleSelectionComplete: assign({
			selectionComplete: ctx => !ctx.selectionComplete
		}),
		toggleQueryReady: assign({
			queryReady: ctx => !ctx.queryReady
		})
	},
	guards: {
		isAutoExecute: ctx => ctx.autoExecute,
		isInCache: ctx => ctx.cached,
		isMatching: ctx => ctx.matching,
		isSelectionComplete: ctx => ctx.selectionComplete,
		isQueryReady: ctx => ctx.queryReady
	}
};

export const testerConfig = {
	id: "TestingBuilder",
	type: "parallel",
	context: tester_context,
	states: {
		Testing: {
			initial: "Idle",
			states: {
				Idle: {
					on: {
						SELECTION_COMPLETE_TOGGLED: {
							target: "Idle",
							actions: "toggleSelectionComplete"
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
		Builder: builderConfig
	}
};

export const BuilderTestMachine = Machine(testerConfig, testerOptions);
