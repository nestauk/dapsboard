import aggParamDocByAggId from 'elasticsearch/config/aggParamDocByAggId';

export const getAggDocs = agg => aggParamDocByAggId[agg]?.__docs;
