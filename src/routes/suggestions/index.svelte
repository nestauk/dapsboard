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
	const SEND_DELAY = 200;
	const keywordFieldTypes = [
		'keyword',
		'keywordArray',
		'textWithKeyword',
		'textWithKeywordArray'
	];


	let response;
	let fieldCounts;
	let selectedFieldName;
	let searchWidget;

	let lastScheduling;
	let searchValue;
	let searchIsFocused = false;
	let awaitingResponse = false;

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
					[selectedFieldName]: query
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

	function computeDetailsQuery (requestedFieldName, term) {
		return {
			size: 0,
			query: {
				term: {
					[requestedFieldName]: term
				}
			},
			aggs: {
				[requestedFieldName]: {
					significant_text: {
						field: requestedFieldName
					}
				}
			}
		};
	}

	async function sendRequest (data) {
		try {
			return await request('POST', url, {data});
		}
		catch (error) {
			return error.jsonMessage;
		}
	}

	let userSelection;
	function computeSelection (counts) {
		const exists = counts.some(item => item.name === userSelection);
		if (!userSelection || !exists) {
			if (fieldCounts.length > 0) {
				return fieldCounts[0].name;
			}
			return null;
		}
		return userSelection;
	}

	async function sendSearchRequest (event) {
		response = null;
		awaitingResponse = true;
		const data = computeSearchQuery(event.detail);
		response = await sendRequest(data);
		awaitingResponse = false;
	}

	async function sendCountRequest () {
		const data = computeCountQuery(searchValue);
		const countResponse = await sendRequest(data);
		// TODO check for error messages
		const fullFieldCounts = mapResponseToFieldCount(countResponse);
		fieldCounts = fullFieldCounts.filter(field =>
			field.count > 0 || field.name === userSelection
		);
		selectedFieldName = computeSelection(fieldCounts);
		console.log("fieldCounts", fieldCounts);
	}

	function sendIfTimeElapsed () {
		const now = Date.now();
		if (now - lastScheduling > SEND_DELAY) {
			sendCountRequest();
		}
	}

	function scheduleCountRequest (event) {
		lastScheduling = Date.now();
		searchValue = event.detail;
		setTimeout(sendIfTimeElapsed, SEND_DELAY);
	}

	async function sendSuggestionsRequest (event) {
		const fieldName = event.detail;
		const info = fieldCounts.find(fieldInfo => fieldInfo.name === fieldName)
		if (info.suggestions) {
			return;
		}
		info.suggestions = ['waiting...'];
		fieldCounts = fieldCounts;
		const data = computeDetailsQuery(fieldName, searchValue);
		const suggestionsResponse = await sendRequest(data);
		// TODO check for error messages
		info.suggestions = suggestionsResponse.aggregations[fieldName].buckets.map(sugg => sugg.key);
		if (info.suggestions.length === 0) {
			info.suggestions.push('-- no suggestions found --')
		}
		fieldCounts = fieldCounts;
		console.log("countRespoonse", info);
	}

	function fieldSelected (event) {
		userSelection = event.detail;
		selectedFieldName = computeSelection(fieldCounts);
	}
	function selectNext () {
		let index = fieldCounts.findIndex(field =>
			field.name === selectedFieldName
		);
		index++;
		if (index < fieldCounts.length) {
			userSelection = fieldCounts[index].name;
			selectedFieldName = computeSelection(fieldCounts);
		}
	}
	function selectPrevious () {
		let index = fieldCounts.findIndex(field =>
			field.name === selectedFieldName
		);
		index--;
		if (index >= 0) {
			userSelection = fieldCounts[index].name;
			selectedFieldName = computeSelection(fieldCounts);
		}
	}

	function handleFocus () {
		searchIsFocused = true;
	}

	function handleBlur () {
		searchIsFocused = false;
	}

	onMount(() => {
		window.onload = () => {
			searchWidget.focus();
		}
	})
</script>

<div class='content'>
	<div class='search-bar'>
		{#if selectedFieldName}
			<label>{selectedFieldName}</label>
		{/if}
		<Search
			bind:this={searchWidget}
			on:search={sendSearchRequest}
			on:edit={scheduleCountRequest}
			on:focus={handleFocus}
			on:blur={handleBlur}
			on:downArrow={selectNext}
			on:upArrow={selectPrevious}
		/>
		{#if searchIsFocused}
			<div class='popdown'>
				<FieldMenu
					{fieldCounts}
					{selectedFieldName}
					on:fieldSelected={fieldSelected}
					on:requestDetails={sendSuggestionsRequest}
				/>
			</div>
		{/if}
	</div>
	<div class='response'>
		{#if awaitingResponse}
			Waiting for response...
		{/if}
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

	.popdown {
		position: absolute;
		width: 25%;
	}
</style>
