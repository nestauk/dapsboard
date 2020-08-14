// eslint-disable-next-line node/no-unpublished-import
import { assign } from 'xstate';

export const configurationOptions = {
	actions: {
		toggleSelectionComplete: assign({
			selectionComplete: ctx => !ctx.selectionComplete
		}),
	},
	guards: {
		isSelectionComplete: ctx => ctx.selectionComplete
	}
};
