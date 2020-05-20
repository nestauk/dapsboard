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
			const fType = schema[f];
			const typeAggs = aggregationsPerType[fType];
			for (let i in typeAggs) {
				const at = typeAggs[i];
				const atName = `${f}_${at}`;
				aggs[atName] = {
					[at]: buildAggregation(at, f)
				};
			}
		}

		return {
			size: 0,
			aggs
		};
	}

	async function requestAllAggregations(fetch, basepath, schema, store) {
		const url = `${basepath}/_search`;
		const data = constructQuery(schema);
		const response = await request(fetch, 'POST', url, {data});
		store.set(response);
	}

	export function preload({ params: {id}, query }) {
		const datasetInfo = routes[id];
		const endpoint = datasetInfo.spec.endpoint_url;
		aggStore.set("loading...");
		if (process.browser)
			requestAllAggregations(this.fetch, endpoint, datasetInfo.spec.schema, aggStore);

		return {
			id,
			spec: datasetInfo.spec,
			aggStore
		}
	}
</script>

<script>
	import * as _ from 'lamb';

	export let id;
	export let spec;
	export let aggStore;
</script>

<svelte:head>
	<title>dapsboard - {id}</title>
</svelte:head>

<div>
	<h3>Dataset Information</h3>
	<JSONTree value={spec} />
	<h3>Aggregation Results</h3>
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
