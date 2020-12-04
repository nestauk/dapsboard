import {integer} from 'types';

export default {
	id: 'doc_count',
	doc: {
		doc_count: 'The amount of documents.',
	},
	docLong: {},
	shape: {
		doc_count: integer
	},
	tag: 'single-value',
}

/*
{
	"doc_count": 357361
}
*/
