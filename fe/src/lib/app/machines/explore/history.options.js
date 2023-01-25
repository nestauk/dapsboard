import {get} from 'svelte/store';
import {assign, send} from 'xstate';

import {makeExplorePath} from '$lib/app/utils/exploreUtils';

const updateCurrentURL = ctx => {
	const {project, source, version} = get(ctx.dataset);
	const fields = get(ctx.selectedFields);
	const url = makeExplorePath({fields, project, source, version});
	ctx.currentURL.set(url);
	return ctx;
}

export const historyOptions = {
	actions: {
		updateCurrentURL: assign(updateCurrentURL),
		sendCurrentUrlUpdated: send('CURRENT_URL_UPDATED'),
		updateEntry: ctx => {
			history.pushState(null, window.title, get(ctx.currentURL));
		}
	},
	guards: {}
};
