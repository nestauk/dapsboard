export const field = 'The field to be used for the aggregation.';
export const missing = 'A value to use if the field is missing entirely';
export const keyed = 'Setting the keyed flag to `true` will associate a unique string key with each bucket and return the ranges as a hash rather than a `{key, value}` array.';
export const script = 'Scripting supports parameterized input.';
export const min_doc_count = 'The mininum amount of documents to be matched an item to be returned. Useful for example to avoid returning a lot of empty bins in histograms.';
export const termsExclude = 'Terms for which not to create buckets.';
export const termsInclude = 'Terms for which to create buckets.';
export const background_filter = 'The default source of statistical information for background term frequencies is the entire index and this scope can be narrowed through the use of a `background_filter` to focus in on significant terms within a narrower context.';

// adjacency_matrix: {
// 	__docs: 'A bucket aggregation returning a form of adjacency matrix. The request provides a collection of named filter expressions, similar to the filters aggregation request.',
// 	filters: 'Named list of Elasticsearch filters: { name1: {...}, ...}',
// 	separator: 'Separator character used in response.'
// },
// children: {
// 	__docs: 'A special single bucket aggregation that selects child documents that have the specified type, as defined in a join field.',
// 	type: 'Points to type / mapping with the value as name'
// },
// composite: {
// 	__docs: 'A multi-bucket aggregation that creates composite buckets from different sources.',
// 	sources: 'The sources parameter controls the sources that should be used to build the composite buckets. The order that the sources are defined is important because it also controls the order the keys are returned.',
// 	size: 'The size parameter can be set to define how many composite buckets should be returned. Used for pagination.',
// 	after: 'To get the next set of buckets, resend the same aggregation with the after parameter set to the after_key value returned in the response. This request uses the after_key value provided in the previous response.'
// },
// filter: {
// 	__docs: 'Defines a single bucket of all the documents in the current document set context that match a specified filter. Often this will be used to narrow down the current aggregation context to a specific set of documents.',
// 	filter: 'Elasticsearch filter object format.'
// },
// filters: {
// 	__docs: 'Defines a multi bucket aggregation where each bucket is associated with a filter. Each bucket will collect all documents that match its associated filter.',
// 	other_bucket: 'Can be set to add a bucket to the response which will contain all documents that do not match any of the given filters.',
// 	other_bucket_key: 'Can be used to set the key for the other bucket to a value other than the default _other_. Setting this parameter will implicitly set the other_bucket parameter to true.',
// 	filters: 'Named list of Elasticsearch filters: { name1: {...}, ...}'
// },
// global: {
// 	__docs: 'Defines a single bucket of all the documents within the search execution context. This context is defined by the indices and the document types you’re searching on, but is not influenced by the search query itself.',
// },
// ip_range: {
// 	__docs: 'A dedicated range aggregation for IP typed fields.',
// 	...metricFieldDocs
// },
