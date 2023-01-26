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
						'updateAggs',
						'sendAggsUpdated'
					],
				},
				TOGGLED_FIELD_COUNTER: {
					target: 'Idle',
					actions: [
						'toggleField',
						'updateAggs',
						'sendAggsUpdated'
					]
				},
				SELECTED_NEXT_FIELD: {
					target: 'Idle',
					actions: [
						'selectNextField',
						'updateAggs',
						'sendAggsUpdated'
					]
				},
				SELECTED_PREVIOUS_FIELD: {
					target: 'Idle',
					actions: [
						'selectPreviousField',
						'updateAggs',
						'sendAggsUpdated'
					]
				},
			}
		}
	}
};
