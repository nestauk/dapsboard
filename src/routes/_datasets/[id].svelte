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
	import JSONTree from 'svelte-json-tree';

	import {constructQuery} from 'elasticsearch/utils/aggQuery';
	import {IS_BROWSER} from 'utils/generic';
	import {request} from 'utils/net';
	import {getSchema, getSearchURL} from 'utils/specs';

	export let id;
	export let dataset;

	let responsePromise;

	function doQuery (data) {
		const url = getSearchURL(dataset);

		return IS_BROWSER && request('POST', url, {data});
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
		<JSONTree value={dataset} />
	</section>

	<section class='query'>
		<header>Query</header>
		<JSONTree value={query} />
	</section>

	<section class='results'>
		<header>Result</header>
		{#await responsePromise}
			Loading...
		{:then response}
			<JSONTree value={response} />
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
