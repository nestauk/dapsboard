import * as _ from 'lamb';
import {toggleItem} from '@svizzle/utils';
import {get} from 'svelte/store';
import {assign, send} from 'xstate';

import {selectionToAggsQuery} from 'app/utils/exploreUtils';

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

const updateQuery = ctx => {
	const fields = get(ctx.selectedFields);
	const {project, source, version} = get(ctx.dataset);
	const query = selectionToAggsQuery({fields, project, source, version});
	ctx.query.set(query);
	return ctx;
}

export const selectingOptions = {
	actions: {
		selectFields: assign(selectFields),
		selectNextField: assign(selectNextField),
		selectPreviousField: assign(selectPreviousField),
		sendQueryUpdated: send('QUERY_UPDATED'),
		toggleField: assign(toggleField),
		updateQuery: assign(updateQuery),
	},
	guards: {
	}
};
