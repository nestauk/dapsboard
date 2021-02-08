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
						'updateQuery',
						'sendQueryUpdated'
					],
				},
				TOGGLED_FIELD_COUNTER: {
					target: 'Idle',
					actions: [
						'toggleField',
						'updateQuery',
						'sendQueryUpdated'
					]
				},
				SELECTED_NEXT_FIELD: {
					target: 'Idle',
					actions: [
						'selectNextField',
						'updateQuery',
						'sendQueryUpdated'
					]
				},
				SELECTED_PREVIOUS_FIELD: {
					target: 'Idle',
					actions: [
						'selectPreviousField',
						'updateQuery',
						'sendQueryUpdated'
					]
				},
			}
		}
	}
};
