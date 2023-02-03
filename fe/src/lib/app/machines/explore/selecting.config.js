export const selectingConfig = {
	initial: 'Idle',
	states: {
		Idle: {
			entry: ['conditionalLog'],
			on: {
				SELECTED_FIELDS: {
					target: 'Idle',
					actions: [
						'selectFields',
						'updateSelectionAggsHierarchy',
						'sendAggsHierarchyUpdated'
					],
				},
				TOGGLED_FIELD_COUNTER: {
					target: 'Idle',
					actions: [
						'toggleField',
						'updateSelectionAggsHierarchy',
						'sendAggsHierarchyUpdated'
					]
				},
				SELECTED_NEXT_FIELD: {
					target: 'Idle',
					actions: [
						'selectNextField',
						'updateSelectionAggsHierarchy',
						'sendAggsHierarchyUpdated'
					]
				},
				SELECTED_PREVIOUS_FIELD: {
					target: 'Idle',
					actions: [
						'selectPreviousField',
						'updateSelectionAggsHierarchy',
						'sendAggsHierarchyUpdated'
					]
				},
			}
		}
	}
};
