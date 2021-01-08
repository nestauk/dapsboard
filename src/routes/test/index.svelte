<script>
	import { onMount } from 'svelte';

	import {request} from 'utils/net';
	import {getSearchURL, getSchema} from 'utils/specs';
	import * as _ from 'lamb';
	import {applyFnMap, makeIsIncluded} from '@svizzle/utils';
	
	import DATASETS from 'app/data/routes.json';

	import Search from 'app/components/Search.svelte';
	import FieldMenu from 'app/components/elementary/FieldMenu.svelte';
	import JSONTree from 'svelte-json-tree';

	const dataset = DATASETS.general_cordis_v0;
	const url = getSearchURL(dataset);

	let response;
	let fieldCounts;
	let selectedField;
	let searchWidget;

	let lastScheduling;
	let searchValue;
	// let searchIsFocused = false;

	let keywordFieldTypes = [
		'keyword',
		'keywordArray',
		'textWithKeyword',
		'textWithKeywordArray'
	];

	const getKeywordFields = _.pipe([
		_.pairs,
		_.filterWith(_.pipe([
			_.getPath('1.type'),
			makeIsIncluded(keywordFieldTypes)
		])),
		_.mapWith(_.getAt(0))
	]);

	const extractCountInfo = applyFnMap({
		name: _.getAt(0),
		count: _.getPath('1.doc_count')
	});

	const mapResponseToFieldCount = _.pipe([
		_.getPath('aggregations.messages.buckets'),
		_.pairs,
		_.mapWith(extractCountInfo),
		_.sortWith([_.getKey('count')]),
		_.reverse
	])

	function computeSearchQuery (query) {
		return {
			query: {
				term: {
					[selectedField]: query
				}
			}
		};
	}

	function computeFieldForCountQuery (name, term) {
		return {
			match : {
				[name] : term
			}
		};
	}

	function computeCountQuery (searchTerm) {
		const schema = getSchema(dataset);
		const keywordFields = getKeywordFields(schema);
		const filters = keywordFields.map(i => [i, computeFieldForCountQuery(i, searchTerm)]);

		const query = {
			size: 0,
			aggs : {
				messages : {
					filters : {
						filters : _.fromPairs(filters)
					}
				}
			}
		};
		return query;
	}

	async function sendRequest (data) {
		try {
			return await request('POST', url, {data});
		}
		catch (error) {
			return error.jsonMessage;
		}
	}

	async function sendSearchRequest (event) {
		const data = computeSearchQuery(event.detail);
		response = await sendRequest(data);
	}

	async function sendCountRequest () {
		const data = computeCountQuery(searchValue);
		const countResponse = await sendRequest(data);
		fieldCounts = mapResponseToFieldCount(countResponse);
		console.log("fieldCounts", fieldCounts);
	}

	function sendIfTimeElapsed () {
		const now = Date.now();
		if (now - lastScheduling > 200) {
			sendCountRequest();
		}
	}

	function scheduleCountRequest (event) {
		lastScheduling = Date.now();
		searchValue = event.detail;
		setTimeout(sendIfTimeElapsed, 200);
	}
	function fieldSelected (event) {
		selectedField = event.detail;
	}
	/*
	function handleFocus () {
		searchIsFocused = true;
	}

	async function handleBlur () {
		setTimeout( () => searchIsFocused = false, 10);
	}*/
	onMount(() => {
		window.onload = () => {
			searchWidget.focus();
		}
	})
</script>

<div class='content'>
	<div class='search-bar'>
		{#if selectedField}
			<label>{selectedField}</label>
		{/if}
		<Search
			bind:this={searchWidget}
			on:search={sendSearchRequest}
			on:edit={scheduleCountRequest}
		/>
		<FieldMenu {fieldCounts} on:fieldSelected={fieldSelected}/>
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
		width: 25%;
		margin: auto;
	}
	.response {
		overflow: auto;
	}
</style>
