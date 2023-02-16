import {arraySum} from '@svizzle/utils';
import * as _ from 'lamb';
import {getBeCoverageEndpointURL} from '$lib/utils/specs.js'

import {authedRequest} from '$lib/app/utils/net.js';

const transformCoverageResponse = _.pipe([
	_.pairs,
	_.mapWith(([key, count]) => [
		key,
		{
			id: key,
			fields: key.split('&'),
			count
		}
	]),
	_.fromPairs
]);

const fieldSetsCache = {};

export const getCoveragePromise = async dataset => {
	const endpoint = getBeCoverageEndpointURL(dataset);

	if (fieldSetsCache[endpoint]) {
		return fieldSetsCache[endpoint];
	}

	const jsonResponse = await authedRequest('GET', endpoint);

	const fieldSetsMap = transformCoverageResponse(jsonResponse);
	const total = arraySum(_.values(fieldSetsMap).map(_.getPath('count')));

	const result = {
		fieldSetsMap,
		total
	}

	fieldSetsCache[endpoint] = result;
	return result;
}
