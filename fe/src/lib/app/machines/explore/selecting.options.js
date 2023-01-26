import {toggleItem} from '@svizzle/utils';
import * as _ from 'lamb';
import {get} from 'svelte/store';
import {assign, send} from 'xstate';

import {selectionToAggs} from '$lib/app/utils/exploreUtils.js';

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

const updateAggs = ctx => {
	const fields = get(ctx.selectedFields);
	const {project, source, version} = get(ctx.dataset);
	const selectionAggs = selectionToAggs({fields, project, source, version});
	ctx.selectionAggs.set(selectionAggs);
	return ctx;
}

export const selectingOptions = {
	actions: {
		selectFields: assign(selectFields),
		selectNextField: assign(selectNextField),
		selectPreviousField: assign(selectPreviousField),
		sendAggsUpdated: send('AGGS_UPDATED'),
		toggleField: assign(toggleField),
		updateAggs: assign(updateAggs),
	},
	guards: {
	}
};
