export const DEFAULT_FIELD_DOCS = 'Click on a field for docs.';
export const DEFAULT_AGG_DOCS = 'Hover on an aggregation for short description or click on the outgoing link for full reference.';

export const docsOptions = {
	actions: {
		/**
		 * Resets the agg doc string to the default text.
		 */
		resetAggDoc: ctx => ctx.aggDocText.set(DEFAULT_AGG_DOCS),
		/**
		 * Resets the field doc string to the default text.
		 */
		resetFieldDoc: ctx => ctx.activeDocs.set(DEFAULT_FIELD_DOCS),
		/**
		 * Sets the agg doc string to be displayed in the UI
		 */
		setAggDoc: (ctx, {docstring}) => ctx.aggDocText.set(docstring),
		/**
		 * Sets the field doc string to be displayed in the UI
		 */
		setFieldDoc: (ctx, {docstring}) => ctx.activeDocs.set(docstring),
	},
	guards: {
	}
};
