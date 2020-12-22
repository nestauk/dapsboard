<script>
	import {request} from 'app/utils/net';
	import {getSearchURL} from 'app/utils/specs';

	import DATASETS from 'app/data/routes.json';

	import Search from 'app/components/Search.svelte';
	import JSONValue from 'app/components/JSONValue.svelte';

	const url = getSearchURL(DATASETS.general_cordis_v0);

	let response = {instructions:'type something above'};

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
	<Search on:search={sendSearchRequest}/>
	<div class='response'>
		<JSONValue value={response} />
	</div>
</div>

<style>
	.content {
		height: 100%;
		display: grid;
		grid-template-rows: min-content 1fr;
		overflow: hidden;
	}
	.response {
		border-top: 1px solid #DDD;
		overflow: auto;
	}
</style>