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
	import DatasetExplorer from 'app/components/DatasetExplorer.svelte';
	import { request } from 'app/net';
	import {
		constructQuery
	} from 'app/elasticsearch';

	export let id;
	export let datasetInfo;

	let query;
	let response;

	function doQuery(query) {
		const endpoint = datasetInfo.spec.dataset.endpoint_url;
		const url = `${endpoint}/_search`;
		return request(fetch, 'POST', url, {query});
	}

	$: query = constructQuery(datasetInfo.spec.dataset.schema);
	$: response = doQuery(query);
</script>

<svelte:head>
	<title>dapsboard - {id}</title>
</svelte:head>

<DatasetExplorer {datasetInfo} {query} {response} />
