import {toggleItem} from '@svizzle/utils';
import * as _ from 'lamb';
import {get} from 'svelte/store';
import {assign, send} from 'xstate';

import {selectionToAggsHierarchy} from '$lib/app/utils/exploreUtils.js';

const selectFields = (ctx, {fields}) => {
	ctx.selectedFields.set(fields);
	return ctx;
}

const toggleField = (ctx, {field}) => {
	ctx.selectedFields.update(fields => toggleItem(fields, field));
	return ctx;
}

const selectNextField = ctx => {
	ctx.selectedFields.update(_.setAt(-1, get(ctx.nextPair)[0]));
	return ctx;
}

const selectPreviousField = ctx => {
	ctx.selectedFields.update(_.setAt(-1, get(ctx.prevPair)[0]));
	return ctx;
}

const updateSelectionAggsHierarchy = ctx => {
	const fields = get(ctx.selectedFields);
	const {project, source, version} = get(ctx.dataset);
	const selectionAggsHierarchy = selectionToAggsHierarchy({fields, project, source, version});
	ctx.selectionAggsHierarchy.set(selectionAggsHierarchy);
	return ctx;
}

export const selectingOptions = {
	actions: {
		selectFields: assign(selectFields),
		selectNextField: assign(selectNextField),
		selectPreviousField: assign(selectPreviousField),
		sendAggsHierarchyUpdated: send('AGGS_HIERARCHY_UPDATED'),
		toggleField: assign(toggleField),
		updateSelectionAggsHierarchy: assign(updateSelectionAggsHierarchy),
	},
	guards: {
	}
};
