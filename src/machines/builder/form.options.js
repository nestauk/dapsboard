export const selectionOptions = {
	actions: {
		/**
		 * Computes lists of selectable elements according to current selection.
		 */
		computeLists: () => false,
		/**
		 * Computes the request body.
		 */
		computeRequest: () => false,
		/**
		 * Deletes any nested forms
		 */
		deleteNestedForms: () => false,
		/**
		 * Determines fields and field types according to current selection.
		 */
		prepareForm: () => false,
		/**
		 * Computes the URL for the current selection and field values
		 */
		setURL: () => false,
		/**
		 * Creates a new form for configuring a subaggregation
		 */
		spawnNestedForm: () => false,
		/**
		 * Stores query results in a cache
		 */
		storeInCache: () => false,
	},
	guards: {
		isInCache: () => false,
		isMatching: () => false,
		isSelectionComplete: () => false,
		isQueryReady: () => false
	}
};
