<script>
	import * as _ from 'lamb';
	import { onMount } from 'svelte';
	import { readable } from 'svelte/store';
	import { RISON } from 'rison2';
	import {page as _page} from '$app/stores';
	import ROUTES from '$lib/app/data/routes.json';

	import { integer } from '$lib/types/index.js';

	import ExternalLink from '$lib/app/components/ExternalLink.svelte';
	import JSONValue from '$lib/app/components/JSONValue.svelte';
	import TypedField from '$lib/app/components/elementary/TypedField.svelte';

	import TabContainer from '$lib/app/components/elementary/TabContainer.svelte';
	import Tab from '$lib/app/components/elementary/Tab.svelte';
	import Select from '$lib/app/components/elementary/Select.svelte';
	import SelectMenu from '$lib/app/components/elementary/SelectMenu.svelte';
	import AggSelector from '$lib/app/components/AggSelector.svelte';
	import PanelMenu from '$lib/app/components/elementary/PanelMenu.svelte';
	import MenuItem from '$lib/app/components/elementary/MenuItem.svelte';
	import IconDelete from '$lib/app/components/icons/IconDelete.svelte';
	import IconClipboard from '$lib/app/components/icons/IconClipboard.svelte';
	import IconCheck from '$lib/app/components/icons/IconCheck.svelte';

	import { createBuilderMachine } from '$lib/app/machines/builder/route.js';
	import { parseParams } from '$lib/app/machines/builder/formediting.options.js';

	import {getAggDocs} from '$lib/elasticsearch/utils/docs.js';
	import {getSearchURL} from '$lib/utils/specs.js';

	const { machine: routeMachine, contextStores: {
		// config
		runQueryOnSelect,
		hideDisabledForms,
		hideDisabledAggregations,
		hideDisabledDatasets,
		hideDisabledFields,
		selectedForm,
		selectedRequestTab,
		showFullResponse,
		resultSize,
		forms,
		dataset,
		// docs
		activeDocs,
		aggDocText,
	}} = createBuilderMachine();

	let clickedFieldDocs;
	let hoveredFieldDocs;
	let formMachine;
	let formContext;

	let formParams;
	let selection = readable({
		aggregation: null,
		type: null,
		field: null,
	});
	// let topBucketOptions = readable([]);
	let bucketOptions = readable([]);
	let bucketMultiFieldOptions = readable([]);
	let nestedBucketOptions = readable([]);
	let metricOptions = readable([]);
	let metricMultiFieldOptions = readable([]);
	let typeOptions = readable([]);
	let datasetOptions = readable([]);
	let fieldOptions = readable([]);
	let aggParamsInfo = readable([]);
	let computedQuery;
	let response;
	let responseHighlighted = true;
	let responseStatus;
	let responseCopied = false;

	// $: topBucketOptions = formContext?.topBucketOptions;
	$: formMachine = $selectedForm?.machine;
	$: formContext = $formMachine?.context;
	$: formParams = formContext?.params;
	$: selection = formContext?.selection;
	$: bucketOptions = formContext?.bucketOptions;
	$: bucketMultiFieldOptions = formContext?.bucketMultiFieldOptions;
	$: nestedBucketOptions = formContext?.nestedBucketOptions;
	$: metricOptions = formContext?.metricOptions;
	$: metricMultiFieldOptions = formContext?.metricMultiFieldOptions;
	$: typeOptions = formContext?.typeOptions;
	$: datasetOptions = formContext?.datasetOptions;
	$: fieldOptions = formContext?.fieldOptions;
	$: aggParamsInfo = formContext?.aggParamsInfo;
	$: computedQuery = formContext?.computedQuery;
	$: response = formContext?.response;
	$: responseStatus = formContext?.responseStatus;

	async function handleCopyResponse () {
		const value = $showFullResponse
			? $response
			: $response.aggregations;
		await navigator.clipboard.writeText(JSON.stringify(value, null, 2));
		responseCopied = true;
		setTimeout(() => {
			responseCopied = false;
		}, 1500);
	}

	const aggSelectionChanged = e => $selectedForm.machine.send(
		'SELECTION_CHANGED',
		{selection: {aggregation: e.detail}}
	);

	function handleDocs (docs, eventType) {
		switch (eventType) {
			case 'set':
				clickedFieldDocs = docs;
				break;
			case 'unset':
				clickedFieldDocs = null;
				break;
			case 'display':
				hoveredFieldDocs = docs;
				break;
			case 'hide':
				hoveredFieldDocs = null;
				break;
			default:
				break;
		}
		const fieldDocs = hoveredFieldDocs || clickedFieldDocs;
		if (fieldDocs) {
			routeMachine.send('FIELD_DOC_SHOWN', {docstring:fieldDocs});
		} else {
			routeMachine.send('FIELD_DOC_DEFAULT');
		}
	}

	function setAggDocs (agg) {
		if (agg) {
			const docstring = getAggDocs(agg);
			routeMachine.send('AGG_DOC_SHOWN', {docstring});
		} else {
			routeMachine.send('AGG_DOC_DEFAULT');
		}
	}

	function getFieldValue (name) {
		return $formParams?.[name];
	}

	let eventType = 'READY';
	onMount(() => {
		const loadPage = ({params}) => {
			const event = {
				query: params.q && RISON.parse(params.q),
			};
			routeMachine.send(eventType);
			parseParams(routeMachine, event);
			eventType = 'ROUTE_CHANGED';
		};

		const pageReloader = () => {
			const urlParams = new URL(document.location.toString()).searchParams;
			loadPage({
				params: _.fromPairs(Array.from(urlParams.entries()))
			});
		};
		addEventListener('popstate', pageReloader);
		const unsubscribe = _page.subscribe(pageReloader);

		/*
		if (process.env.INSPECT === 'true') {
			const module = await import('@xstate/inspect');
			module.inspect({
				url: "https://statecharts.io/inspect",
				iframe: false
			});
		}
		*/

		return () => {
			removeEventListener('popstate', pageReloader);
			unsubscribe?.();
		};
	});
</script>

<section class='query-builder'>
	<section class='axes'>
		<header class='bold'>Axes</header>
		<Select
			selectedOption={$selectedForm?.value}
			hideDisabled={$hideDisabledForms}
			options={$forms}
			unselectable={false}
			on:selectionChanged={e => routeMachine.send(
				'FORM_SELECTED',
				{form: $forms.find(f => f.value === e.detail)}
			)}
			let:option={option}
		>
			<div class='select-item'>
				<div>{option.text}</div>
				<div on:click={() => {
					const payload = {
						selection: {
							aggregation: null,
							type: null,
							field: null
						},
					};
					if (option.value === 0) {
						payload.dataset = null;
					}
					option.machine.send('SELECTION_CHANGED', payload);
				}}>
					<IconDelete size={14} />
				</div>
			</div>
		</Select>
	</section>

	<section class='agreggations'>
		<SelectMenu
			hideDisabled={$hideDisabledAggregations}
			on:hideDisabledChanged={e => routeMachine.send(
				'HIDE_DISABLED_AGGS_TOGGLED',
				e.detail
			)}
		/>
		<header class='bold'>Aggregations</header>
		<section>
			<AggSelector
				title='Bucketing'
				selectedOption={$selection.aggregation}
				hideDisabled={$hideDisabledAggregations}
				options={$bucketOptions}
				{setAggDocs}
				selectionChangedHandler={aggSelectionChanged}
			/>
			<AggSelector
				title='Bucketing (multi-field)'
				selectedOption={$selection.aggregation}
				hideDisabled={$hideDisabledAggregations}
				options={$bucketMultiFieldOptions}
				{setAggDocs}
				selectionChangedHandler={aggSelectionChanged}
			/>
			<AggSelector
				title='Bucketing (nested)'
				selectedOption={$selection.aggregation}
				hideDisabled={$hideDisabledAggregations}
				options={$nestedBucketOptions}
				{setAggDocs}
				selectionChangedHandler={aggSelectionChanged}
			/>
			<AggSelector
				title='Metric'
				selectedOption={$selection.aggregation}
				hideDisabled={$hideDisabledAggregations}
				options={$metricOptions}
				{setAggDocs}
				selectionChangedHandler={aggSelectionChanged}
			/>
			<AggSelector
				title='Metric (multi-field)'
				selectedOption={$selection.aggregation}
				hideDisabled={$hideDisabledAggregations}
				options={$metricMultiFieldOptions}
				{setAggDocs}
				selectionChangedHandler={aggSelectionChanged}
			/>
		</section>
	</section>

	<section class='types'>
		<header class='bold'>Types</header>
		<Select
			selectedOption={$selection.type}
			options={$typeOptions}
			on:selectionChanged={e => $selectedForm.machine.send(
				'SELECTION_CHANGED',
				{selection: {type: e.detail}}
			)}
		/>
	</section>

	<section class='datasets'>
		<SelectMenu
			hideDisabled={$hideDisabledDatasets}
			on:hideDisabledChanged={e => routeMachine.send(
				'HIDE_DISABLED_DSETS_TOGGLED',
				e.detail
			)}
		/>
		<header class='bold'>Datasets</header>
		<Select
			selectedOption={$dataset}
			hideDisabled={$hideDisabledDatasets}
			options={$datasetOptions}
			on:selectionChanged={e => $selectedForm.machine.send(
				'SELECTION_CHANGED',
				{dataset: e.detail}
			)}
			disabled={$selectedForm?.value !== 0}
			let:option={option}
		>
			<div class='select-item'>
				<div>{option.text}</div>
				<ExternalLink href={getSearchURL(ROUTES[option.text])} size={14} />
			</div>
		</Select>
	</section>

	<section class='fields'>
		<SelectMenu
			hideDisabled={$hideDisabledFields}
			on:hideDisabledChanged={e => routeMachine.send(
				'HIDE_DISABLED_FIELDS_TOGGLED',
				e.detail
			)}
		/>
		<header class='bold'>Fields</header>
		<Select
			selectedOption={$selection.field}
			hideDisabled={$hideDisabledFields}
			options={$fieldOptions}
			on:selectionChanged={e => $selectedForm.machine.send(
				'SELECTION_CHANGED',
				{selection: {field: e.detail}}
			)}
		/>
	</section>

	<TabContainer
		className='request'
		selectedTab={$selectedRequestTab}
		on:change={e => routeMachine.send(
			'REQUEST_TAB_SELECTED',
			{selectedRequestTab: e.detail}
		)}
		let:isTitleSlot
		let:isContentSlot
	>
		<Tab id='fields' {isTitleSlot} {isContentSlot}>
			<header slot='title' class='bold'>Query Form</header>
			<div class='form-fields'>
				<TypedField
					labelText='result size'
					required='true'
					dataType='integer'
					typeObject={integer}
					value={$resultSize}
					on:change={e => $selectedForm.machine.send(
						'QUERY_CHANGED',
						{resultSize: e.detail}
					)}
					on:docs={e => handleDocs(
						'Maximum size of results returned.',
						e.detail
					)}
				/>
				{#each $aggParamsInfo as paramInfo (
					`${$dataset}-${$selection.field}-`
					+ `${$selection.aggregation}-${paramInfo.paramId}`
				)}
					{#if !['field'].includes(paramInfo.paramId)}
						<TypedField
							labelText={paramInfo.paramId}
							required={paramInfo.required}
							dataType={paramInfo.displayText}
							typeObject={paramInfo.type}
							value={getFieldValue(paramInfo.paramId)}
							on:change={e => $selectedForm.machine.send(
								'QUERY_CHANGED',
								{params:{[paramInfo.paramId]: e.detail}}
							)}
							on:docs={e => handleDocs(
								paramInfo.documentation,
								e.detail
							)}
						/>
					{/if}
				{/each}
			</div>
			<div class='query-bottom'>
				<div class='help-text'>
					{$activeDocs}
				</div>
				{#if !$runQueryOnSelect}
					<button
						disabled={
							!$formMachine.matches({
								SelectionComplete: {
									QueryReady: "Dirty"
								}
							})
						}
						on:click={() => $selectedForm.machine.send(
							'QUERY_EXECUTED'
						)}
						class='query-button'
					>Run query</button>
				{:else if $formMachine?.matches({
					SelectionComplete: {
						QueryReady: "Dirty"
					}
				})}
					<div class='query-button'>
						Press Enter or Tab to run the query
					</div>
				{/if}
				<PanelMenu position='static' className='query-menu' popup='top'>
					<MenuItem>
						<input
							checked={$runQueryOnSelect}
							on:change={e => routeMachine.send(
								'AUTO_EXEC_TOGGLED',
								e.target.checked
							)}
							id='runQueryOnSelectID'
							type='checkbox'
						>
						<label
							class='clickable'
							for='runQueryOnSelectID'
						>Run query on select</label>
					</MenuItem>
				</PanelMenu>
			</div>
		</Tab>
		<Tab id='request' {isTitleSlot} {isContentSlot}>
			<header slot='title' class='bold'>Query Editor</header>
			<JSONValue
				editable={true}
				value={$computedQuery}
				on:change={event => formMachine.send(
					'JSON_EDIT',
					{json: event.detail}
				)}
			/>
			<div class='query-bottom'>
				{#if !$runQueryOnSelect}
					<button
						disabled={
							!$formMachine.matches({
								SelectionComplete: {
									QueryReady: "Dirty"
								}
							})
						}
						on:click={() => $selectedForm.machine.send(
							'QUERY_EXECUTED'
						)}
						class='query-button'
					>Run query</button>
				{/if}
				<PanelMenu position='static' className='query-menu' popup='top'>
					<MenuItem>
						<input
							checked={$runQueryOnSelect}
							on:change={e => routeMachine.send(
								'AUTO_EXEC_TOGGLED',
								e.target.checked
							)}
							id='runQueryOnSelectID'
							type='checkbox'
						>
						<label
							class='clickable'
							for='runQueryOnSelectID'
						>Run query on select</label>
					</MenuItem>
				</PanelMenu>
			</div>
		</Tab>
	</TabContainer>

	<section class='response'>
		<PanelMenu>
			<MenuItem>
				<input
					checked={$showFullResponse}
					on:change={e => routeMachine.send(
						'SHOW_FULL_RESPONSE_TOGGLED',
						e.target.checked
					)}
					id='showFullResponseID'
					type='checkbox'
				>
				<label
					class='clickable'
					for='showFullResponseID'
				>Show full response</label>
			</MenuItem>
			<MenuItem>
				<input
					bind:checked={responseHighlighted}
					id='highlightedID'
					type='checkbox'
				>
				<label
					class='clickable'
					for='highlightedID'
				>Syntax highlighting</label>
			</MenuItem>
		</PanelMenu>
		<header class='bold response-header'>
			<div>Response</div>
			{#if $responseStatus?.matching || $responseStatus?.error}
				<div
					class='panel-tools clickable'
					title={`Copy ${$responseStatus.matching
						? 'response'
						: 'error'
					} to clipboard`}
					on:click={handleCopyResponse}
				>
					{#if !responseCopied}
						<IconClipboard size={14} />
					{:else}
						<IconCheck size={14} stroke='green' />
					{/if}
				</div>
			{/if}
		</header>
		<div class='json'>
			{#if $responseStatus?.pending}
				Waiting for response...
			{:else if $responseStatus?.matching}
				<JSONValue
					value={$showFullResponse
						? $response
						: $response.aggregations
					}
					highlighted={responseHighlighted}
				/>
			{:else if $responseStatus?.error}
				<JSONValue
					value={$response}
					highlighted={responseHighlighted}
					isErrorValue={true}
				/>
			{/if}
		</div>
	</section>

	<section class='status-bar'>
		{$aggDocText}
	</section>
</section>

<style>
	.query-builder {
		height: 100%;
		display: grid;
		grid-template-areas:
			"axes agreggations types datasets fields request"
			"axes agreggations types datasets fields response"
			"statusbar statusbar statusbar statusbar statusbar statusbar";
		grid-template-columns:
			fit-content(100%)
			fit-content(100%)
			fit-content(100%)
			fit-content(100%)
			fit-content(100%)
			1fr;
		grid-auto-rows: auto 1fr;
	}
	.axes {grid-area: axes;}
	.agreggations {grid-area: agreggations;}
	.types {grid-area: types;}
	.datasets {grid-area: datasets;}
	.fields {grid-area: fields;}
	:global(.request) {
		border-bottom: 1px solid var(--color-main-lighter);
		grid-area: request;
		height: fit-content !important;
	}
	.response {grid-area: response;}

	.axes,
	.agreggations,
	.types,
	.datasets,
	.fields {
		border-right: 1px solid var(--color-main-lighter);
	}

	.axes,
	.agreggations,
	.types,
	.datasets,
	.fields,
	.response {
		display: grid;
		grid-template-areas: "header" "select";
		grid-template-rows: min-content auto min-content;
		overflow: hidden;
		overflow-y: auto;
		box-sizing: border-box;
		height: 100%;
		padding: 1em;
		position: relative;
		min-width: 12em;
	}

	.status-bar {
		grid-area: statusbar;
		border-top: 1px solid var(--color-main-lighter);
		padding: 0.5em;
	}

	header {
		grid-area: header;
		font-weight: bold;
		font-size: 1.1em;
		margin: .5em 0;
	}
	.json {
		grid-area: select;
		overflow: auto;
		height: 100%;
	}

	.select-item {
		display: grid;
		grid-template-columns: 1fr min-content;
		grid-column-gap: 1em;
	}

	.query-bottom {
		display: grid;
		grid-template-columns: auto min-content;
		grid-template-rows: min-content min-content;
		grid-row-gap: 0.5em;
		padding-top: 1em;
	}
	.query-button {
		padding: 0.4em;
	}

	.help-text {
		grid-column: 1 / span 2 ;
		min-height: 6em;
		box-shadow: inset 1px 1px 4px rgba(0,0,0,0.125);
		padding: 0.5em;
		border-radius: 4px;
		z-index: 1;
		background: #fbfbed;
	}

	.form-fields {
		display: grid;
		grid-template-columns: min-content auto;
		grid-gap: 1em;
		grid-auto-rows: min-content;
		align-items: start;
	}

	:global(.query-menu) {
		justify-self: end;
		grid-column: 2;
		padding:0.4em 0 0.4em 1em;
	}

	.response-header {
		display: grid;
		grid-template-columns: 1fr min-content;
	}
	.panel-tools {
		display: inline-block;
		margin-right: 24px;
		margin-top: 2px;
	}
</style>
