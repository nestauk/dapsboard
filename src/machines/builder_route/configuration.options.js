// eslint-disable-next-line node/no-unpublished-import
import { assign } from 'xstate';

export const configurationOptions = {
	actions: {
		toggleAxisComplete: assign({
			axisComplete: ctx => !ctx.axisComplete
		}),
	},
	guards: {
		isAxisComplete: ctx => ctx.axisComplete
	}
};
