export const resultsConfig = {
	id: 'Results',
	initial: 'CheckMatching',
	on: {
		AGGS_UPDATED: {
			target: '#Results.CheckMatching'
		}
	},
	states: {
		CheckMatching: {
			entry: ['conditionalLog'],
			always: [
				{
					target: 'Matching',
					cond: 'isMatching'
				},
				{ target: 'Dirty' }
			]
		},
		Matching: {
			id: 'Matching',
			entry: [
				'conditionalLog',
				'sendResultsUpdated'
			],
		},
		Dirty: {
			id: 'Dirty',
			initial: 'CheckingCache',
			entry: ['conditionalLog'],
			states: {
				CheckingCache: {
					entry: [
						'conditionalLog',
						'setCacheKey',
					],
					always: [
						{
							target: '#Matching',
							cond: 'isInCache',
							actions: ['loadFromCache']
						},
						{
							target: 'UpdatingQueue',
							actions: ['initQueue']
						}
					]
				},
				UpdatingQueue: {
					entry: [
						'conditionalLog',
						'updateAggsParams',
						'updateQueue',
					],
					always: [
						{
							target: 'Pending',
							cond: 'hasQuery',
						},
						{
							target: '#Matching',
							actions: [
								'updateCache',
								'updateCurrentResults',
								'resetQueue',
							]
						},
					]
				},
				Pending: {
					entry: ['conditionalLog'],
					invoke: {
						id: 'request',
						src: 'apiRequest',
						onDone: {
							target: 'UpdatingQueue',
							actions: [
								'mergeQueueResults',
							]
						},
						onError: {
							target: 'Error',
						}
					}
				},
				Error: {
					id: 'Error',
					entry: [
						'conditionalLog',
						'getError'
					],
				}
			}
		}
	}
};
