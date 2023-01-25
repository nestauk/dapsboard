import {actions, assign} from 'xstate';

import {stringifyContextStores} from '$lib/app/machines/utils';
import {
	resetSources,
	selectSource,
	selectDataset,
} from '$lib/app/stores/exploreStores';
import {getDatasetOf} from '$lib/app/utils/data';
import {getSearchURL} from '$lib/utils/specs';

const {choose, log} = actions;

const setDataset = (ctx, {project, source, version}) => {
	ctx.dataset.set({project, source, version});

	return ctx;
}

const setURL = (ctx, {project, source, version}) => {
	const dataset = getDatasetOf({project, source, version});
	const queryURL = getSearchURL(dataset);
	ctx.queryURL.set(queryURL);

	return ctx;
}

const loggedEvents = [
	// 'xstate.init',
	// 'QUERY_UPDATED',
	// 'SEARCH_QUERY_UPDATED'
];

export const routeOptions = {
	actions: {
		conditionalLog: choose([
			{
				cond: 'logGuard',
				actions: [
					log(
						(context, event) => `---- context: ${stringifyContextStores(context)}\n\n---- event: ${JSON.stringify(event)}`,
						'conditionalLog'
					)
				]
			},
		]),
		setDataset: assign(setDataset),
		setURL: assign(setURL),
		resetSources: () => {
			resetSources()
		},
		selectDataset: (ctx, {project, source, version}) => {
			selectDataset({project, source, version})
		},
		selectSource: (ctx, {source}) => {
			selectSource(source)
		},
	},
	guards: {
		logGuard: (context, event) => loggedEvents.includes(event.type)
	}
};
