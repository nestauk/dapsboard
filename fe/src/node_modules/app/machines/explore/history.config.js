export const historyConfig = {
	id: 'History',
	initial: 'Idle',
	states: {
		Idle: {
			on: {
				RESULTS_UPDATED: {
					target: 'Idle',
					actions: [
						'updateCurrentURL',
						'sendCurrentUrlUpdated',
						'conditionalLog'
					]
				},
				CURRENT_URL_UPDATED: {
					target: 'Idle',
					actions: [
						'updateEntry',
						'conditionalLog'
					]
				}
			},
		},
	}
};
