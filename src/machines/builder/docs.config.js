export const docsConfig = {
	"initial": "Idle",
	"states": {
		"Idle": {
			"on": {
				"FIELD_DOC_SHOWN": {
					"target": "Idle"
				},
				"FIELD_DOC_DEFAULT": {
					"target": "Idle"
				},
				"AGG_DOC_SHOWN": {
					"target": "Idle"
				},
				"AGG_DOC_DEFAULT": {
					"target": "Idle"
				},
			}
		}
	}
};
