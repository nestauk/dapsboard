export const configurationConfig = {
	initial: "Idle",
	states: {
		Idle: {
			on: {
				AUTO_EXEC_TOGGLED: {
					target: "Idle",
					actions: ['toggleAutoExecute']
				}
			}
		}
	}
};
