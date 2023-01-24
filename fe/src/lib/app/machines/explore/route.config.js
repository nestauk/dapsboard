import {selectingConfig} from './selecting.config';
import {historyConfig} from './history.config';
import {resultsConfig} from './results.config';
import {searchConfig} from 'app/machines/explore/search.config.js';

export const exploreConfig = {
	id: 'ExploreRoute',
	initial: 'Interactive',
	states: {
		Interactive: {
			type: 'parallel',
			states: {
				// order counts for rendering in the visualiser
				History: historyConfig,
				Selecting: selectingConfig,
				Results: resultsConfig,
				Search: searchConfig
			},
			on: {
				DATASET_UPDATED: {
					target: '#ExploreRoute.Interactive',
					actions: [
						'selectDataset',
						'setDataset',
						'setURL',
					]
				},
				RESET_SOURCES: {
					target: '#ExploreRoute.Interactive',
					actions: ['resetSources']
				},
				SELECT_SOURCE: {
					target: '#ExploreRoute.Interactive',
					actions: ['selectSource']
				},
			},
		}
	}
};
