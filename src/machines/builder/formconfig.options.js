// eslint-disable-next-line node/no-unpublished-import
import { assign } from 'xstate';

export const configurationOptions = {
	actions: {
		/**
		 * Toggles auto-executing requests when the query is valid
		 */
		toggleAutoExecute: assign({
			autoExecute: ctx => !ctx.autoExecute
		}),
		/**
		 * Hide unselectable axes. Default: true
		 */
		toggleHideDisabledAxes: assign({
			hideDisabledAxes: ctx => !ctx.hideDisabledAxes
		}),
		/**
		 * Hide unselectable aggregations. Default: false
		 */
		toggleHideDisabledAggs: assign({
			hideDisabledAggs: ctx => !ctx.hideDisabledAggs
		}),
		/**
		 * Hide unselectable datasets. Default: false
		 */
		toggleHideDisabledDatasets: assign({
			hideDisabledDatasets: ctx => !ctx.hideDisabledDatasets
		}),
		/**
		 * Hide unselectable fields. Default: true
		 */
		toggleHideDisabledFields: assign({
			hideDisabledItems: ctx => !ctx.hideDisabledItems
		}),
		/**
		 * Show full response or only aggregation results.
		 */
		toggleShowFullResponse: assign({
			showFullResponse: ctx => !ctx.showFullResponse
		})
	},
	guards: {
	}
};
