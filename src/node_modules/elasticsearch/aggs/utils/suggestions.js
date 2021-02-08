import * as _ from 'lamb';
import {isIterableEmpty} from '@svizzle/utils';

export const makeGetSuggestionsBy = searchQuery => _.pipe([
	_.filterWith(sugg => sugg.key !== searchQuery),
	_.sortWith([
		_.sorterDesc(_.getKey('doc_count')),
		_.getKey('key')
	]),
	_.mapWith(sugg => `${sugg.key} (${sugg.doc_count})`),
	_.when(isIterableEmpty, _.always(['-- no suggestions found --']))
]);
