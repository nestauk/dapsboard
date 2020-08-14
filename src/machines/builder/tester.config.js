// eslint-disable-next-line node/no-unpublished-import
import { Machine, assign } from 'xstate';

import { routeConfig } from './route.js';

const tester_context = {
	autoExecute: false,
	cached: false,
	hideDisabledAxes: true,
	hideDisabledAggs: false,
	hideDisabledDatasets: false,
	hideDisabledItems: true,
	matching: false,
	selectionComplete: false,
	showFullResponse: false,
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
		toggleHideDisabledAxes: assign({
			hideDisabledAxes: ctx => !ctx.hideDisabledAxes
		}),
		toggleHideDisabledAggs: assign({
			hideDisabledAggs: ctx => !ctx.hideDisabledAggs
		}),
		toggleHideDisabledDatasets: assign({
			hideDisabledDatasets: ctx => !ctx.hideDisabledDatasets
		}),
		toggleHideDisabledItems: assign({
			hideDisabledItems: ctx => !ctx.hideDisabledItems
		}),
		toggleShowFullResponse: assign({
			showFullResponse: ctx => !ctx.showFullResponse
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
	id: 'TestingBuilder',
	type: 'parallel',
	context: tester_context,
	states: {
		GuardsConfig: {
			initial: 'Idle',
			states: {
				Idle: {
					on: {
						SELECTION_COMPLETE_TOGGLED: {
							target: 'Idle',
							actions: 'toggleSelectionComplete'
						},
						QUERY_READY_TOGGLED: {
							target: 'Idle',
							actions: 'toggleQueryReady'
						},
						MATCHING_TOGGLED: {
							target: 'Idle',
							actions: 'toggleMatching'
						},
						CACHED_TOGGLED: {
							target: 'Idle',
							actions: 'toggleCached'
						}
					}
				}
			}
		},
		Route: routeConfig
	}
};

export const BuilderTestMachine = Machine(testerConfig, testerOptions);
