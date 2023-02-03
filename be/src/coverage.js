import * as _ from 'lamb';

import { count, getMappings } from 'dap_dv_backends_utils/es/index.mjs';
import { scroll } from 'dap_dv_backends_utils/es/search.mjs';

const isFieldInDoc = (field, doc) => {
	if (field in doc) {
		return doc[field] !== null;
	}
	return false;
}

const computeSet = (fields, doc) => {
	const set = _.filter(fields, f => isFieldInDoc(f, doc))
	const setString = _.join(set, '&');
	return setString;
}

export const coverage = async (domain, index) => {
	const total = await count(domain, index);
	const mapping = await getMappings(domain, index);
	const fields = _.keys(
		mapping[index].mappings.properties ||
		mapping[index].mappings._doc.properties
	);
	const scroller = scroll(domain, index, {size: 10000});
	const counts = {};
	let progress = 0;
	let page;
	for await (page of scroller) {
		_.forEach(
			page.hits.hits,
			doc => {
				const set = computeSet(fields, doc._source);
				counts[set] = set in counts ? counts[set] + 1 : 1;
			}
		);
		progress += page.hits.hits.length;
		console.log(progress / total);
	}
	return counts;
}
