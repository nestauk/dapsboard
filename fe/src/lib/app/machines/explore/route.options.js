import {actions, assign} from 'xstate';

import {stringifyContextStores} from '$lib/app/machines/utils.js';
import {
	resetSources,
	selectSource,
	selectDataset,
} from '$lib/app/stores/exploreStores.js';
import {getDatasetOf} from '$lib/app/utils/data.js';
import {getBeSearchURL} from '$lib/utils/specs.js';

const {choose, log} = actions;

const setDataset = (ctx, {project, source, version}) => {
	ctx.dataset.set({project, source, version});

	return ctx;
}

const setNeededFields = (ctx, {neededFields}) => {
	ctx._neededFields.set(neededFields?.split(',') || []);

	return ctx;
}

const setURL = (ctx, {project, source, version}) => {
	const dataset = getDatasetOf({project, source, version});
	const queryURL = getBeSearchURL(dataset);
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
		setNeededFields: assign(setNeededFields),
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
