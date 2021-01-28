export const searchConfig = {
	id: 'Search',
	type: 'parallel',
	on: {
		RESET_SEARCH: {
			actions: ['resetSearchContext']
		}
	},
	states: {
		SearchInput: {
			id: 'SearchInput',
			initial: 'Idle',
			states: {
				Idle: {
					entry: ['conditionalLog'],
					on: {
						TYPED: {
							target: 'Idle',
							actions: [
								'updateSearchQuery',
								'sendSearchQueryUpdated',
							]
						},
						SEARCHED: {
							target: 'Idle',
							actions: [
								'setMenuInactive',
								'updateQuery',
								'sendQueryUpdated',
							]
						},
					},
				},
			}
		},
		Fields: {
			initial: 'Idle',
			on: {
				FIELD_SELECTED: {
					target: '.CheckingCache',
					actions: [
						'updateCurrentField',
						'sendFieldUpdated',
					]
				},
				NEXT_FIELD_SELECTED: {
					target: '.CheckingCache',
					actions: [
						'selectNextSearchField',
						'sendFieldUpdated',
					]
				},
				PREV_FIELD_SELECTED: {
					target: '.CheckingCache',
					actions: [
						'selectPrevSearchField',
						'sendFieldUpdated',
					]
				},
				SEARCH_QUERY_UPDATED: {
					target: '.CheckingCache',
				},
			},
			states: {
				Idle: {
					on: {
						FIELD_STATS_SHOWN: {
							actions: ['setMenuActive']
						},
						FIELD_STATS_HIDDEN: {
							actions: ['setMenuInactive']
						}
					}
				},
				CheckingCache: {
					entry: [
						'setStatsCacheKey',
						'conditionalLog',
					],
					always: [
						{
							target: 'Idle',
							cond: 'isInStatsCache',
							actions: ['loadStatsFromCache'],
						},
						{ target: 'Pending' }
					]
				},
				Pending: {
					entry: ['conditionalLog'],
					invoke: {
						id: 'StatsRequest',
						src: 'fieldsStatsRequest',
						onDone: {
							target: 'Idle',
							actions: [
								'updateStatsCache',
								'updateFieldStats',
								'sendFieldUpdated'
							]
						},
						onError: {
							target: 'Error',
						}
					}
				},
				Error: {
					id: 'FieldsError',
					entry: [
						'conditionalLog',
						'getFieldsError'
					],
				}
			}
		},
		Suggestions: {
			initial: 'Idle',
			on: {
				FIELD_UPDATED: {
					target: '.CheckingCache',
				},
				SEARCH_QUERY_UPDATED: {
					target: '.CheckingCache'
				}
			},
			states: {
				Idle: {},
				CheckingCache: {
					entry: [
						'conditionalLog',
						'setSuggestionsCacheKey',
					],
					always: [
						{
							target: 'Idle',
							cond: 'isSuggestionsRequestIncomplete',
						},
						{
							target: 'Idle',
							cond: 'isInSuggestionsCache',
							actions: [
								'loadSuggestionsFromCache',
							],
						},
						{ target: 'Pending' }
					]
				},
				Pending: {
					entry: [
						'conditionalLog',
						'setAsWaiting'
					],
					invoke: {
						id: 'SuggestionsRequest',
						src: 'suggestionsRequest',
						onDone: {
							target: 'Idle',
							actions: [
								'updateSuggestionsCache',
								'updateSuggestions',
								'sendFieldUpdated'
							]
						},
						onError: {
							target: 'Error',
						}
					}
				},
				Error: {
					id: 'SuggestionsError',
					entry: [
						'conditionalLog',
						'getSuggestionsError'
					],
				}
			}
		},
	},
};
