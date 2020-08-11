const isAxisComplete = () => false;
const isQueryReady = () => false;
const isInCache = () => true;
const isMatching = () => true;

export const builder_config = {
	id: "Builder",
	type: "parallel",
	states: {
		"Loading": {
			id: "Loading",
			on: {
				"READY": {
					target: "Axis",
					actions: ['parseParams']
				}
			}
		},
		"Axis": {
			id: "Axis",
			initial: "CheckingAxis",
			states: {
				"CheckingAxis": {
					id: "CheckingAxis",
					on: {
						'': [
							{
								target: 'AxisComplete',
								cond: isAxisComplete,
								actions: ['spawnAxis']
							},
							{ target: 'AxisIncomplete' }
						]
					}
				},
				"AxisIncomplete": {
					id: "AxisIncomplete",
					on: {
						'SELECTION_CHANGED': {
							target: "CheckingAxis",
							actions: ['setURL']
						},
						"AXIS_RESET": {
							target: "AxisIncomplete",
							actions: ['deleteChildren']
						}
					}
				},
				"AxisComplete": {
					id: "AxisComplete",
					initial: "CheckingQuery",
					on: {
						'SELECTION_CHANGED': {
							target: "CheckingAxis",
							actions: ['setURL']
						},
						"AXIS_RESET": {
							target: "AxisIncomplete",
							actions: ['deleteChildren']
						}
					},
					states: {
						"CheckingQuery": {
							id: "CheckingQuery",
							on: {
								'': [
									{
										target: 'QueryReady',
										cond: isQueryReady
									},
									{ target: 'FormEditable' }
								]
							}
						},
						"FormEditable": {
							id: "FormEditable",
							on: {
								"QUERY_CHANGED": {
									target: "CheckingQuery",
									actions: ['setURL']
								}
							},
						},
						"QueryReady": {
							id: "QueryReady",
							initial: "CheckMatching",
							on: {
								"QUERY_CHANGED": {
									target: "CheckingQuery",
									actions: ['setURL']
								}
							},
							states: {
								"CheckMatching": {
									onEntry: ["verifyMatching"],
									on: {
										'': [
											{
												target: 'Matching',
												cond: isMatching
											},
											{ target: 'Dirty' }
										]
									}
								},
								"Matching": {
									id: "Matching",
									onEntry: "pushHistory"
								},
								"Dirty": {
									id: "Dirty",
									initial: "CheckingCache",
									onEntry: "shareDirty",
									on: {
										"QUERY_EXECUTED": {
											target: "Dirty"
										}
									},
									states: {
										"CheckingCache": {
											onEntry: ["searchInCache"],
											on: {
												'': [
													{
														target: '#Matching',
														cond: isInCache
													},
													{ target: 'Pending' }
												]
											}
										},
										"Pending": {
											onEntry: "sharePending",
											invoke: {
												id: "Pending",
												src: "apiRequest",
												onDone: {
													target: "#Matching"
												},
												onError: {
													target: "#Error",
												}
											}
										},
										"Error": {
											id: "Error",
											onEntry: "shareError"
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
