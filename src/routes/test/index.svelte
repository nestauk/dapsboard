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

<Search on:search={sendSearchRequest}/>

<JSONValue value={response} />
