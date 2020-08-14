// eslint-disable-next-line node/no-unpublished-import
import { assign } from 'xstate';

export const configurationOptions = {
	actions: {
		toggleAutoExecute: assign({
			autoExecute: ctx => !ctx.autoExecute
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
		})
	},
	guards: {
	}
};
