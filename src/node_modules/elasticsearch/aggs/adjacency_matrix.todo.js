// multi-field
// 7.10: no params table
// https://www.elastic.co/guide/en/elasticsearch/reference/7.9/search-aggregations-bucket-adjacency-matrix-aggregation.html

// adjacency_matrix: {
// 	filters: recordLike({
// 		values: recordLike({
// 			keys: enumsOf(['aggId']),
// 			values: recordLike({
// 				keys: enumsOf(['field']),
// 				values: arrayOf(string)
// 			})
// 		})
// 	}),
// 	separator: string
// },
