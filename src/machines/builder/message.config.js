// Default -> docstring_on -> showing -> docstring_off -> Default
export const messageConfig = {
	initial: 'Default',
	states: {
		Default: {
			on: {
				DOCSTRING_ON: {
					target: 'Showing'
				}
			}
		},
		Showing: {
			on: {
				DOCSTRING_OFF: {
					target: 'Default'
				}
			}
		}
	}
};
