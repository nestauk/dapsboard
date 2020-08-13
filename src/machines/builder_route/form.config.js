export const selectionConfig = {
	initial: 'CheckingSelection',
	on: {
		SELECTION_CHANGED: {
			target: 'Form.CheckingSelection',
			actions: ['setURL']
		},
		SELECTION_RESET: {
			target: 'Form.SelectionIncomplete',
			actions: [
				'deleteNestedForms',
				'setURL'
			]
		}
	},
	states: {
		CheckingSelection: {
			on: {
				'': [
					{
						target: 'SelectionComplete',
						cond: 'isSelectionComplete',
						actions: ['spawnNestedForm']
					},
					{ target: 'SelectionIncomplete' }
				]
			}
		},
		SelectionIncomplete: {},
		SelectionComplete: {
			initial: 'CheckingQuery',
			on: {
				QUERY_CHANGED: {
					target: 'SelectionComplete.CheckingQuery',
					actions: ['setURL']
				}
			},
			states: {
				CheckingQuery: {
					id: 'CheckingQuery',
					on: {
						'': [
							{
								target: 'QueryReady',
								cond: 'isQueryReady'
							},
							{ target: 'QueryNotReady' }
						]
					}
				},
				QueryNotReady: {
					id: 'QueryNotReady',
				},
				QueryReady: {
					id: 'QueryReady',
					initial: 'CheckMatching',
					states: {
						CheckMatching: {
							onEntry: ['verifyMatching'],
							on: {
								'': [
									{
										target: 'Matching',
										cond: 'isMatching'
									},
									{ target: 'Dirty' }
								]
							}
						},
						Matching: {
							id: 'Matching',
							onEntry: [
								'pushHistory'
							]
						},
						Dirty: {
							id: 'Dirty',
							initial: 'Idle',
							on: {
								QUERY_EXECUTED: {
									target: 'Dirty.CheckingCache'
								}
							},
							states: {
								Idle: {
									on: {
										'': [
											{
												target: 'CheckingCache',
												cond: 'isAutoExecute'
											}
										]
									}
								},
								CheckingCache: {
									onEntry: ['searchInCache'],
									on: {
										'': [
											{
												target: '#Matching',
												cond: 'isInCache'
											},
											{ target: 'Pending' }
										]
									}
								},
								Pending: {
									invoke: {
										id: 'Pending',
										src: 'apiRequest',
										onDone: {
											target: '#Matching',
											actions: ['storeInCache']
										},
										onError: {
											target: '#Error',
										}
									}
								},
								Error: {
									id: 'Error'
								}
							}
						}
					}
				}
			}
		}
	}
};
