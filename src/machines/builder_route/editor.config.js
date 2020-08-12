import { axis_config } from './axis.config';

export const editor_config = {
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
		// TODO The proper name should be `Interactive` and it should probably
		// house a full machine instance, with its own distinct `id` inside.
		"Axis": axis_config
	}
};
