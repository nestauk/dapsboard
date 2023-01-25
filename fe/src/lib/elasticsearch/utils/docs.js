import aggParamDocByAggId from '$lib/elasticsearch/config/aggParamDocByAggId.js';

export const getAggDocs = agg => aggParamDocByAggId[agg]?.__docs;
