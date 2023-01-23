<script>
	import JSONTree from 'svelte-json-tree';

	import {browser} from '$app/environment';
	import {page as _page} from '$app/stores';

	import routes from '$lib/app/data/routes.json';
	import {constructQuery} from '$lib/elasticsearch/utils/aggQuery';
	import {request} from '$lib/utils/net';
	import {getSchema, getSearchURL} from '$lib/utils/specs';

	let id;
	let dataset;
	let responsePromise;

	let schema;
	let query;

	function doQuery (data) {
		const url = getSearchURL(dataset);

		return browser && request('POST', url, {data});
	}

	$: browser && ({params: {id}} = $_page);
	$: dataset = routes[id];
	$: dataset && (schema = getSchema(dataset));
	$: schema && (query = constructQuery(schema));
	$: query && (responsePromise = doQuery(query));
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
