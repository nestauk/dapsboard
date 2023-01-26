import {isNotNil} from '@svizzle/utils';
import * as _ from 'lamb';
import {derived, writable} from 'svelte/store';

import {
	selectedDatasetFieldsIndicesMap,
	selectedDatasetFieldsZip,
} from '$lib/app/stores/exploreStores.js';

export const createSelectionStores = () => {
	const selectedFields = writable([]);
	const availableFieldsZip = derived(
		[selectedDatasetFieldsZip, selectedFields],
		([zip, fields]) =>
			zip && fields && _.filter(zip, ([field]) => !fields.includes(field))
	);
	const lastSelectedField = derived(selectedFields, _.last);
	const lastSelectedFieldIndex = derived(
		[selectedDatasetFieldsIndicesMap, lastSelectedField],
		([map, field]) => isNotNil(map) && isNotNil(field) && map[field]
	);
	const nextPair = derived(
		[availableFieldsZip, lastSelectedFieldIndex],
		([zip, index]) =>
			isNotNil(zip)
			&& isNotNil(index)
			&& _.find(zip, ([,idx]) => idx > index)
	);
	const isNextFieldDisabled = derived(nextPair, _.isUndefined);
	const prevPair = derived(
		[availableFieldsZip, lastSelectedFieldIndex],
		([zip, index]) =>
			isNotNil(zip)
			&& isNotNil(index)
			&& _.findLast(zip, ([,idx]) => idx < index)
	);
	const isPrevFieldDisabled = derived(prevPair, _.isUndefined);

	return {
		isNextFieldDisabled,
		isPrevFieldDisabled,
		nextPair,
		prevPair,
		selectedFields,
		selectionAggs: writable({}),
	}
};
