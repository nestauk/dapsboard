import aggParamDocByAggId from '$lib/elasticsearch/config/aggParamDocByAggId';

export const getAggDocs = agg => aggParamDocByAggId[agg]?.__docs;