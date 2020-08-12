// eslint-disable-next-line node/no-unpublished-import
import { assign } from 'xstate';

export const configuration_options = {
	guards: {
		"isAxisComplete": ctx => ctx.axisComplete
	},
	actions: {
		"toggleAxisComplete": assign({
			axisComplete: ctx => !ctx.axisComplete
		}),
	}
};
