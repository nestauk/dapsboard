export const builder_config = {
	id: "Builder",
	type: "parallel",
	states: {
		"Configurable": {
			initial: "Idle",
			states: {
				"Idle": {
					on: {
						"AUTO_EXEC_TOGGLED": {
							target: "Idle",
							actions: ['toggleAutoExecute']
						}
					}
				}
			}
		},
		"Editing": {
			initial: 'Loading',
			states: {
				"Loading": {
					on: {
						"READY": {
							target: "Axis",
							actions: ['parseParams']
						}
					}
				},
				"Navigating": {
					on: {
						"NAVIGATED": {
							target: "Axis",
							actions: ['parseParams']
						}
					}
				},
				"Axis": {}
			}
		}
	}
};
