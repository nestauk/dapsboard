import * as _ from 'lamb';
import {splitByDot} from '@svizzle/utils';

const splitVersion = _.pipe([splitByDot, _.mapWith(Number)]);

export const makeIsAggVersionCompatible = refVerString => {
	const [refMajor, refMinor] = splitVersion(refVerString);

	return agg => {
		const [fromMajor, fromMinor] = splitVersion(agg.availability.from);

		let pass =
			refMajor > fromMajor
			|| refMajor === fromMajor && refMinor >= fromMinor;

		if (pass && agg.availability.to) {
			const [toMajor, toMinor] = splitVersion(agg.availability.to);

			pass =
				refMajor < toMajor
				|| refMajor === toMajor && refMinor <= toMinor;
		}

		return pass;
	}
}
