import * as _ from 'lamb';
import {optionalKey} from '$lib/elasticsearch/types/params';

/* conditions */

export const is_optional = _.hasKey(optionalKey);
export const is_required = _.not(is_optional);

/* dimensional types */

/* TODO
export const isValidInterval
	- check it ends with a string in interval.units
	- remove the unit
	- @svizzle/utils.isValidNumber

export const isValidCalendarInterval
	- check it ends with a string in calendarInterval.units
	- remove the unit
	- @svizzle/utils.isValidNumber

export const isValidFixedInterval
	- check it ends with a string in fixedInterval.units
	- remove the unit
	- @svizzle/utils.isValidNumber
*/
