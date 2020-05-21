<script context='module'>
	import { writable } from 'svelte/store';
	import {
		aggregationsPerType,
		determineESType,
		buildAggregation
	} from 'app/elasticsearch';
	import {
		request
	} from 'app/net';

	import JSONTree from 'svelte-json-tree'

	import routes from 'app/data/routes.json';

	export const aggStore = writable("");

	function constructQuery(schema) {
		const fields = Object.keys(schema);
		const aggs = {};
		for ( let f in schema ) {
			const fType = determineESType(schema[f]);
			const typeAggs = aggregationsPerType[fType];
			for (let i in typeAggs) {
				const at = typeAggs[i];
				const atName = `${f}_${at}`;
				aggs[atName] = {
					[at]: buildAggregation(at, f, schema[f])
				};
			}
		}

		return {
			size: 0,
			aggs
		};
	}

	function requestAllAggregations(fetch, basepath, schema, store) {
		const url = `${basepath}/_search`;
		const data = constructQuery(schema);
		request(fetch, 'POST', url, {data}).then( response => store.set(response));
		//const response = await request(fetch, 'POST', url, {data});
		//store.set(response);
		return data;
	}

	export function preload({ params: {id}, query }) {
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
