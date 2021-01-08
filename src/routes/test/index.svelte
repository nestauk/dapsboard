<script>
	import {request} from 'utils/net';
	import {getSearchURL} from 'utils/specs';

	import DATASETS from 'app/data/routes.json';

	import Search from 'app/components/Search.svelte';
	import JSONTree from 'svelte-json-tree';

	const url = getSearchURL(DATASETS.general_cordis_v0);

	let response;

	function computeQuery (query) {
		return {
			query: {
				term: {
					textBody_description_project: query
				}
			}
		};
	}

	async function sendSearchRequest (event) {
		const data = computeQuery(event.detail);
		try {
			response = await request('POST', url, {data});
		}
		catch (error) {
			response = error.jsonMessage;
		}
	}
</script>

<div class='content'>
	<div class='search-bar'>
		<Search on:search={sendSearchRequest}/>
	</div>
	<div class='response'>
		{#if response}
			<JSONTree value={response} />
		{/if}
	</div>
</div>

<style>
	.content {
		height: 100%;
		display: grid;
		grid-template-rows: min-content 1fr;
		overflow: hidden;
	}
	.search-bar {
		width: 75%;
		margin: auto;
	}
	.response {
		overflow: auto;
	}
</style>
