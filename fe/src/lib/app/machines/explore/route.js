import {createMachina} from '../utils.js';

import {createHistoryStores} from './history.context.js';
import {historyOptions} from './history.options.js';
import {createResultsStores} from './results.context.js';
import {resultsOptions} from './results.options.js';
import {exploreConfig} from './route.config.js';
import {createRouteStores} from './route.context.js';
import {routeOptions} from './route.options.js';
import {createSelectionStores} from './selecting.context.js';
import {selectingOptions} from './selecting.options.js';
import {createSearchStores} from './search.context.js';
import {searchOptions} from './search.options.js';

/* TODO
// nm/svizzle/utils/array-[array-object].js: makeMergeBy
// nm/app/machines/utils: mergeMachines

const mergeMachines = makeMergeBy(['actions', 'guards', 'services']);
mergeMachines([
	historyOptions,
	resultsOptions,
	routeOptions,
	selectingOptions
])
*/
export const exploreOptions = {
	actions: {
		...historyOptions.actions,
		...resultsOptions.actions,
		...routeOptions.actions,
		...selectingOptions.actions,
		...searchOptions.actions,
	},
	guards: {
		...historyOptions.guards,
		...resultsOptions.guards,
		...routeOptions.guards,
		...selectingOptions.guards,
		...searchOptions.guards,
	},
	services: {
		...resultsOptions.services,
		...searchOptions.services,
	}
};

export const contextStores = {
	...createHistoryStores(),
	...createResultsStores(),
	...createRouteStores(),
	...createSelectionStores(),
	...createSearchStores(),
};

export const createExploreMachine = () => createMachina(
	exploreConfig,
	exploreOptions,
	contextStores
);
