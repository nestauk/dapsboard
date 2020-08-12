export const configuration_config = {
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
};
