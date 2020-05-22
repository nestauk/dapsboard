<script context='module'>
	import JSONTree from 'svelte-json-tree'

	//import { AggregationStore as aggStore } from 'app/stores';
	import routes from 'app/data/routes.json';

	export function preload({ params: {id} }) {
		const datasetInfo = routes[id];

		return {
			id,
			datasetInfo
		}
	}
</script>

<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import * as _ from 'lamb';

	import { request } from 'app/net';
	import {
		constructQuery
	} from 'app/elasticsearch';

	export let id;
	export let datasetInfo;

	let query;
	let response;

	function loadInfo(datasetInfo) {
		const schema = datasetInfo.spec.dataset.schema
		return constructQuery(schema);
	}

	function doQuery(query) {
		const endpoint = datasetInfo.spec.dataset.endpoint_url;
		const url = `${endpoint}/_search`;
		return request(fetch, 'POST', url, {query});
	}

	$: query = loadInfo(datasetInfo);
	$: response = doQuery(query);
</script>

<svelte:head>
	<title>dapsboard - {id}</title>
</svelte:head>

<div>
	<h2>Dataset Information</h2>
	<JSONTree value={datasetInfo} />
	<h2>Query</h2>
	<JSONTree value={query} />
	<h2>Aggregation Results</h2>
	{#await response}
		Loading...
	{:then value}
		<JSONTree {value} />
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</div>

<style>
	div {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		font-family: courier;
	}
</style>
