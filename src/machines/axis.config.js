export const builder_config = {
	id: "Axis",
	initial: "CheckingAxis",
	on: {
		'SELECTION_CHANGED': {
			target: "Axis.CheckingAxis",
			actions: ['setURL']
		},
		"AXIS_RESET": {
			target: "Axis.AxisIncomplete",
			actions: [
				'deleteChildAxes',
				'setURL'
			]
		}
	},
	states: {
		"CheckingAxis": {
			id: "CheckingAxis",
			on: {
				'': [
					{
						target: 'AxisComplete',
						cond: 'isAxisComplete',
						actions: ['spawnChildAxis']
					},
					{ target: 'AxisIncomplete' }
				]
			}
		},
		"AxisIncomplete": {
			id: "AxisIncomplete",
		},
		"AxisComplete": {
			id: "AxisComplete",
			initial: "CheckingQuery",
			on: {
				"QUERY_CHANGED": {
					target: "AxisComplete.CheckingQuery",
					actions: ['setURL']
				}
			},
			states: {
				"CheckingQuery": {
					id: "CheckingQuery",
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
				"QueryNotReady": {
					id: "QueryNotReady",
				},
				"QueryReady": {
					id: "QueryReady",
					initial: "CheckMatching",
					states: {
						"CheckMatching": {
							onEntry: ["verifyMatching"],
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
						"Matching": {
							id: "Matching",
							onEntry: [
								"notifyMatching",
								"pushHistory"
							]
						},
						"Dirty": {
							id: "Dirty",
							initial: "Idle",
							onEntry: "notifyDirty",
							on: {
								"QUERY_EXECUTED": {
									target: "Dirty.CheckingCache"
								}
							},
							states: {
								"Idle": {
									on: {
										'': [
											{
												target: 'CheckingCache',
												cond: 'isAutoExecute'
											}
										]
									}

								},
								"CheckingCache": {
									onEntry: ["searchInCache"],
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
								"Pending": {
									onEntry: "notifyPending",
									invoke: {
										id: "Pending",
										src: "apiRequest",
										onDone: {
											target: "#Matching",
											actions: ['storeInCache']
										},
										onError: {
											target: "#Error",
										}
									}
								},
								"Error": {
									id: "Error",
									onEntry: "notifyError"
								}
							}
						}
					}
				}
			}
		}
	}
};
