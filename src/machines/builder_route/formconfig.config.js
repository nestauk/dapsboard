export const configurationConfig = {
	initial: "Idle",
	states: {
		Idle: {
			on: {
				AUTO_EXEC_TOGGLED: {
					target: "Idle",
					actions: ['toggleAutoExecute']
				},
				HIDE_DISABLED_AXES_TOGGLED: {
					target: "Idle",
					actions: ['toggleHideDisabledAxes']
				},
				HIDE_DISABLED_AGGS_TOGGLED: {
					target: "Idle",
					actions: ['toggleHideDisabledAggs']
				},
				HIDE_DISABLED_DSETS_TOGGLED: {
					target: "Idle",
					actions: ['toggleHideDisabledDataset']
				},
				HIDE_DISABLED_FIELDS_TOGGLED: {
					target: "Idle",
					actions: ['toggleHideDisabledFields']
				},
				SHOW_FULL_RESPONSE_TOGGLED: {
					target: "Idle",
					actions: ['toggleShowFullResponse']
				},
				REQUEST_TAB_SELECTED: {
					target: "Idle",
					actions: ['showTab']
				}
			}
		}
	}
};
