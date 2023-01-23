import * as _ from 'lamb';

export const parseSearchParams = searchParams => {
	const query = _.fromPairs(Array.from(searchParams.entries()));
	return query;
}
