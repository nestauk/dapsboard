import * as _ from 'lamb';

export const collectionToObject =
	collection => _.fromPairs(Array.from(collection.entries()));
