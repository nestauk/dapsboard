export const selectionOptions = {
	actions: {
		computeLists: () => false,
		computeRequest: () => false,
		deleteNestedForms: () => false,
		prepareForm: () => false,
		setURL: () => false,
		spawnNestedForm: () => false,
		storeInCache: () => false,
	},
	guards: {
		isInCache: () => false,
		isMatching: () => false,
		isSelectionComplete: () => false,
		isQueryReady: () => false
	}
};
