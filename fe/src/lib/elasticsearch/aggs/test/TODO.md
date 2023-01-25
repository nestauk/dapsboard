- all aggs
	- have `id` === file name
	- have `availability` and at least `availability.from`
	- have `response`
	- have `request`
	- have `requestDoc`
	- `requestDoc` have all the paths on `request`
	- have `tag` being one of `metric`, `bucketing`
- all responses
	- have `id`
	- have `tag`