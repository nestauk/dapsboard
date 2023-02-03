import * as _ from 'lamb';
import {getBeCoverageEndpointURL} from '$lib/utils/specs.js'

const transform = _.pipe([
	_.pairs,
	_.mapWith(([key, count]) => ({
		fieldSet: key.split('&'),
		count
	}))
]);

export const getFieldSetsPromise = async dataset => {
	const endpoint = getBeCoverageEndpointURL(dataset);
	const response = await fetch(endpoint);
	const responseJson = await response.json();
	const fieldSets = transform(responseJson);
	return fieldSets;
}
