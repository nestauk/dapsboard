export const docsConfig = {
	initial: 'Idle',
	states: {
		Idle: {
			on: {
				FIELD_DOC_SHOWN: {
					target: 'Idle',
					actions: ['setFieldDoc']
				},
				FIELD_DOC_DEFAULT: {
					target: 'Idle',
					actions: ['resetFieldDoc']
				},
				AGG_DOC_SHOWN: {
					target: 'Idle',
					actions: ['setAggDoc']
				},
				AGG_DOC_DEFAULT: {
					target: 'Idle',
					actions: ['resetAggDoc']
				},
			}
		}
	}
};
