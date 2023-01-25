import * as _ from 'lamb';
import {derived, writable} from 'svelte/store';
import {
	findValueWith,
	getId,
	makeIndexByKey,
	mergeObj,
	negate,
	valuesWith,
} from '@svizzle/utils';

import Datasets from '$lib/app/data/datasets.json';
import {indexById} from '$lib/utils/generic';
import {getDatasetIdOf, getSchema, groupBySource} from '$lib/utils/specs';
import {safeApply} from '$lib/utils/svizzle/utils/[any-any]-[any-any]';

/* sources */

const makeSources = _.pipe([
	groupBySource,
	_.mapValuesWith(_.pipe([
		_.sortWith([getId]),
		_.collect([_.getPath('0.id'), _.identity, indexById]),
		([activeDatasetId, datasets, datasetsById]) => ({
			activeDatasetId,
			datasets,
			datasetsById,
			isExpanded: false,
			isSelected: false,
		})
	]))
]);

const defaultSources = makeSources(Datasets);

export const sources = writable(defaultSources);

export const resetSources = () => sources.set(defaultSources);

export const selectSource = source =>
	sources.set(_.setPathIn(defaultSources, `${source}.isSelected`, true));

export const toggleSource = source =>
	sources.update(_.updatePath(`${source}.isExpanded`, negate));

export const selectDataset = ({project, source, version}) =>
	sources.set(_.updatePathIn(
		defaultSources,
		source,
		mergeObj({
			isSelected: true,
			isExpanded: false,
			activeDatasetId: getDatasetIdOf({project, source, version}),
		})
	));

/* selectedDataset */

const getIsSelected = _.getKey('isSelected');

const getSelectedDataset = _.pipe([
	findValueWith(getIsSelected),
	obj => obj && obj.datasetsById[obj.activeDatasetId]
]);
export const selectedDataset = derived(sources, getSelectedDataset);
export const selectedDatasetSchema = derived(selectedDataset, safeApply(getSchema));
export const selectedDatasetFields = derived(selectedDatasetSchema, safeApply(_.keys));
export const selectedDatasetFieldsIndicesMap = derived(selectedDatasetFields, safeApply(makeIndexByKey));
export const selectedDatasetFieldsZip = derived(selectedDatasetFields, safeApply(_.zipWithIndex));

/* navigator */

const makeNavigator = valuesWith(
	({
		activeDatasetId,
		datasets,
		datasetsById,
		isExpanded,
		isSelected
	}, source) => ({
		activeDataset: datasetsById[activeDatasetId],
		activeDatasetId,
		datasets,
		datasetsById,
		isExpanded,
		isSelected,
		source,
	}),
);

export const navigator = derived(sources, makeNavigator);
