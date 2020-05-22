<script context='module'>
	import { writable } from 'svelte/store';
	import JSONTree from 'svelte-json-tree'

	import { requestAllAggregations } from 'app/elasticsearch';
	//import { AggregationStore as aggStore } from 'app/stores';
	import routes from 'app/data/routes.json';

	const aggStore = writable("");

	export function preload({ params: {id} }) {
		const datasetInfo = routes[id];
		const endpoint = datasetInfo.spec.dataset.endpoint_url;
		aggStore.set("loading...");
		let requestData;
		if (process.browser)
			requestData = requestAllAggregations(this.fetch, endpoint, datasetInfo.spec.dataset.schema, aggStore);

		return {
			id,
			spec: datasetInfo.spec,
			query: requestData,
			aggStore
		}
	}
</script>

<script>
	import * as _ from 'lamb';

	export let id;
	export let spec;
	export let query;
	export let aggStore;
</script>

<svelte:head>
	<title>dapsboard - {id}</title>
</svelte:head>

<div>
	<h2>Dataset Information</h2>
	<JSONTree value={spec} />
	<h2>Query</h2>
	<JSONTree value={query} />
	<h2>Aggregation Results</h2>
	<JSONTree value={$aggStore} />
</div>

<style>
	div {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		font-family: courier;
	}
</style>
