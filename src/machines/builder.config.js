export const builder_config = {
	id: "Builder",
	initial: 'Loading',
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
		"Navigating": {
			id: "Navigating",
			on: {
				"NAVIGATED": {
					target: "Axis",
					actions: ['parseParams']
				}
			}
		},
		"Axis": {}
	}
};
