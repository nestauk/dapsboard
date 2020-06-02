<script context='module'>
	import routes from 'app/data/routes.json';

	export function preload ({ params: {id} }) {
		const dataset = routes[id];

		return {
			id,
			dataset
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
	import { IS_BROWSER, getEndpointURL, getSchema } from 'app/utils';

	export let id;
	export let dataset;

	let responsePromise;

	function doQuery (data) {
		const endpoint = getEndpointURL(dataset);
		const url = `${endpoint}/_search`;

		return IS_BROWSER && request(fetch, 'POST', url, {data});
	}

	$: schema = getSchema(dataset);
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
		<SchemaExplorer schema={dataset} />
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
