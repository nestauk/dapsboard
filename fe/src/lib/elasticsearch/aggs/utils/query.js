import * as _ from 'lamb';

import {getDefault, hasDefault} from '$lib/types';
import {stopWords} from '$lib/utils/stopwords';

// params that startsWith('__') should be required, with no default
export const makeRequestToQuery = fieldName => _.pipe([
	_.collect([
		obj => _.has(obj, 'field') ? {field: fieldName} : {},
		_.pipe([_.pickIf(hasDefault), _.mapValuesWith(getDefault)])
	]),
	_.apply(_.merge)
]);

/**
 * Get how many items have a `searchTerm` in the input `fields`
 */
export const getCountQuery = (fields, searchTerm) => ({
	size: 0,
	aggs: {
		messages: {
			filters: {
				filters: _.fromPairs(fields.map(name => [name, {
					term: {
						[name]: searchTerm
					}
				}]))
			}
		}
	}
});

/**
 * Get significant words for a `term` in the input `field`
 */
export const getSuggestionsQuery = (field, term) => ({
	size: 0,
	query: {
		term: {
			[field]: term
		}
	},
	aggs: {
		[field]: {
			significant_text: {
				field,
				// TODO include/exclude according to ES version
				include: stopWords,
				min_doc_count: 1,
				size: 20
			}
		}
	}
});
