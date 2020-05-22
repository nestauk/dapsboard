<script context='module'>
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
	import SchemaExplorer from 'app/components/SchemaExplorer.svelte';
	import QueryExplorer from 'app/components/QueryExplorer.svelte';
	import ResultExplorer from 'app/components/ResultExplorer.svelte';
	import {
		constructQuery
	} from 'app/elasticsearch';
	import { request } from 'app/net';

	export let id;
	export let datasetInfo;

	let responsePromise;

	function doQuery(_query) {
		const endpoint = datasetInfo.spec.dataset.endpoint_url;
		const url = `${endpoint}/_search`;
		return request(fetch, 'POST', url, {data: _query});
	}

	/* eslint-disable prefer-destructuring */
	$: schema = datasetInfo.spec.dataset.schema;
	$: query = constructQuery(schema);
	$: responsePromise = doQuery(query);
</script>

<svelte:head>
	<title>dapsboard - {id}</title>
</svelte:head>

<section class='dataset'>
	<header>Dataset {id}</header>

	<section class='schema'>
		<header>Info</header>
		<SchemaExplorer schema={datasetInfo} />
	</section>

	<section class='query'>
		<header>Query</header>
		<QueryExplorer {schema} {query} />
	</section>

	<section class='results'>
		<header>Result</header>
		{#await responsePromise}
			Loading...
		{:then response}
			<ResultExplorer {schema} {query} {response} />
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
	</section>

	<footer>footer</footer>
</section>

<style>
	.dataset {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		font-family: courier;
		display: grid;
		grid-template-areas:
			"header header header"
			"schema query results"
			"footer footer footer";
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: 0fr 1fr 0fr;
	}
	header 	{grid-area: header;}
	footer 	{grid-area: footer;}
	.schema {grid-area: schema;}
	.query 	{grid-area: query;}
	.results {grid-area: results;}

	.schema,
	.query,
	.results {
		overflow: auto;
	}
</style>
