<script>
	// eslint-disable-next-line node/no-unpublished-import
	import * as _ from 'lamb';
	// eslint-disable-next-line node/no-unpublished-import
	import { onMount } from 'svelte';
	// eslint-disable-next-line node/no-unpublished-import
	import { readable } from 'svelte/store';
	// eslint-disable-next-line node/no-unpublished-import
	import rison from 'rison-esm';
	import { stores } from '@sapper/app';

	import JSONValue from 'app/components/JSONValue.svelte';
	import ESField from 'app/components/elementary/ElasticSearchField.svelte';

	import TabContainer from 'app/components/elementary/TabContainer.svelte';
	import Tab from 'app/components/elementary/Tab.svelte';
	import Select from 'app/components/elementary/Select.svelte';
	import SelectMenu from 'app/components/elementary/SelectMenu.svelte';
	import PanelMenu from 'app/components/elementary/PanelMenu.svelte';
	import MenuItem from 'app/components/elementary/MenuItem.svelte';
	import IconDelete from 'app/components/icons/IconDelete.svelte';
	import ExternalLink from 'app/components/ExternalLink.svelte';

	import { createBuilderMachine } from 'app/machines/builder/route';
	import { parseParams } from 'app/machines/builder/_options';

	import { AGG_DOC_URLS } from 'app/elasticsearch/config';
	import aggCompletions from 'app/data/agg_docs.json';
	import { request } from 'app/net';

	import { inspect } from "@xstate/inspect";

	if (process.env.INSPECT === 'true') {
		inspect({
			url: "https://statecharts.io/inspect",
			iframe: false
		});
	}

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
	let bucketOptions = readable([]);
	let metricOptions = readable([]);
	let typeOptions = readable([]);
	let datasetOptions = readable([]);
	let fieldOptions = readable([]);
	let completions = readable([]);
	let computedQuery;
	let response;

	$: formMachine = $selectedForm && $selectedForm.machine;
	$: formContext = $formMachine && $formMachine.context;
	$: formParams = formContext && formContext.params;
	$: selection = formContext && formContext.selection;
	$: bucketOptions = formContext && formContext.bucketOptions;
	$: metricOptions = formContext && formContext.metricOptions;
	$: typeOptions = formContext && formContext.typeOptions;
	$: datasetOptions = formContext && formContext.datasetOptions;
	$: fieldOptions = formContext && formContext.fieldOptions;
	$: completions = formContext && formContext.completions;
	$: computedQuery = formContext && formContext.computedQuery;
	$: response = formContext && formContext.response;

	function handleDocs (docs, eventType) {
		const docsText = docs.map(i => i.text ? i.text : '').join(' ');
		switch (eventType) {
			case 'set':
				clickedFieldDocs = docsText;
				break;
			case 'unset':
				clickedFieldDocs = null;
				break;
			case 'display':
				hoveredFieldDocs = docsText;
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
		}
		else {
			routeMachine.send('FIELD_DOC_DEFAULT');
		}
	}

	function setAggDocs (agg) {
		if (aggCompletions && agg in aggCompletions) {
			routeMachine.send('AGG_DOC_SHOWN', {
				docstring: aggCompletions[agg]
			});
		} else {
			routeMachine.send('AGG_DOC_DEFAULT');
		}
	}

	function getFieldValue (name) {
		return $formParams && $formParams[name] || null;
	}

	const { page } = stores();
	let eventType = 'READY';
	onMount(async () => {
		const datasetTypings = await request(
			'GET',
			'dsl/datasets.ts',
			{type:'text'}
		);
		const loadPage = ({params}) => {
			const event = {
				query: params.q && rison.decode(params.q),
				datasetTypings,
			};
			if (window.ts) {
				routeMachine.send(eventType);
				if (!event.query) {
					routeMachine.send('COMMITTED');
				}
				parseParams(routeMachine, event);
				eventType = 'ROUTE_CHANGED';
			} else {
				const tsCompiler = document.getElementById('tsCompiler');
				tsCompiler.onload = () => {
					routeMachine.send(eventType);
					if (!event.query) {
						routeMachine.send('COMMITTED');
					}
					parseParams(routeMachine, event);
					eventType = 'ROUTE_CHANGED';
				}
			}
		};

		const pageReloader = () => {
			const urlParams = new URL(document.location).searchParams;
			loadPage({
				params: _.fromPairs(Array.from(urlParams.entries()))
			});
		};
		addEventListener('popstate', pageReloader);
		const unsubscribe = page.subscribe(pageReloader);

		return () => {
			removeEventListener('popstate', pageReloader);
			unsubscribe && unsubscribe();
		};
	});

</script>

<svelte:head>
	<script src="https://cdn.jsdelivr.net/gh/microsoft/TypeScript@3.9.5/lib/typescriptServices.js" id='tsCompiler'></script>
</svelte:head>

<section class="query-builder">
	<section class='axes'>
		<SelectMenu 
			hideDisabled={$hideDisabledForms}
			on:hideDisabledChanged={e => routeMachine.send(
				'HIDE_DISABLED_FORMS_TOGGLED',
				e.detail
			)}
		/>
		<header class='bold'>Axes</header>
		<Select
			selectedOption={$selectedForm && $selectedForm.value}
			hideDisabled={$hideDisabledForms}
			options={$forms}
			unselectable={false}
			on:selectionChanged={e => {
				routeMachine.send(
					'FORM_SELECTED',
					{form: $forms.find(f => f.value === e.detail)}
				);
				routeMachine.send('EDITED');
			}}
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
					// routeMachine.send('EDITED');
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
			<header class='semibold'>Bucketing</header>
			<Select
				selectedOption={$selection.aggregation}
				hideDisabled={$hideDisabledAggregations}
				options={$bucketOptions}
				on:selectionChanged={e => {
					formMachine.send(
						'SELECTION_CHANGED',
						{selection: {aggregation: e.detail}}
					);
					// routeMachine.send('EDITED');
				}}
				let:option={option}
			>
				<div 
					class='select-item'
					on:mouseover={() => setAggDocs(option.value)}
					on:mouseout={() => setAggDocs(null)}
				>
					<div>{option.text}</div>
					<ExternalLink  href={AGG_DOC_URLS[option.value]} size={14} />
				</div>
			</Select>
			<header class='semibold'>Metrics</header>
			<Select
				selectedOption={$selection.aggregation}
				hideDisabled={$hideDisabledAggregations}
				options={$metricOptions}
				on:selectionChanged={e => {
					$selectedForm.machine.send(
						'SELECTION_CHANGED',
						{selection: {aggregation: e.detail}}
					);
					// routeMachine.send('EDITED');
				}}
				let:option={option}
			>
			<div 
				class='select-item' 
				on:mouseover={() => setAggDocs(option.value)}
				on:mouseout={() => setAggDocs(null)}
			>
				<div>{option.text}</div>
					<ExternalLink href={AGG_DOC_URLS[option.value]} size={14} />
				</div>
			</Select>
		</section>
	</section>

	<section class='types'>
		<header class='bold'>Types</header>
		<Select
			selectedOption={$selection.type}
			options={$typeOptions}
			on:selectionChanged={e => {
				$selectedForm.machine.send(
					'SELECTION_CHANGED',
					{selection: {type: e.detail}}
				)
				// routeMachine.send('EDITED');
			}}
		/>
	</section>

	<section class='datasets'>
		<SelectMenu 
			hideDisabled={$hideDisabledDatasets}
			on:hideDisabledChanged={e => {
				routeMachine.send(
					'HIDE_DISABLED_DSETS_TOGGLED',
					e.detail
				)
				// routeMachine.send('EDITED');
			}}
		/>
		<header class='bold'>Datasets</header>
		<Select
			selectedOption={$dataset}
			hideDisabled={$hideDisabledDatasets}
			options={$datasetOptions}
			on:selectionChanged={e => {
				$selectedForm.machine.send(
					'SELECTION_CHANGED',
					{dataset: e.detail}
				)
				// routeMachine.send('EDITED');
			}}
			disabled={$selectedForm && $selectedForm.value !== 0}
		/>
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
			on:selectionChanged={e => {
				$selectedForm.machine.send(
					'SELECTION_CHANGED',
					{selection: {field: e.detail}}
				)
				// routeMachine.send('EDITED');
			}}
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
				<ESField
					labelText='result size'
					required=true
					dataType='Opaque<number, "integer">'
					value={$resultSize}
					on:change={e => {
						$selectedForm.machine.send(
							'QUERY_CHANGED',
							{resultSize: e.detail}
						);
						// routeMachine.send('EDITED');
					}}
					on:docs={e => handleDocs(
						[{text:'Maximum size of results returned.'}],
						e.detail
					)}
				/>
				{#each $completions as completion (
					`${$dataset}-${$selection.field}-`
					+ `${$selection.aggregation}-${completion.name}`
				)}
					{#if completion.name !== 'field'}
						<ESField
							labelText={completion.name}
							required={completion.required}
							dataType={completion.displayText}
							value={getFieldValue(completion.name)}
							on:change={e => {
								$selectedForm.machine.send(
									'QUERY_CHANGED',
									{params:{[completion.name]: e.detail}}
								);
								// routeMachine.send('EDITED');
							}}
							on:docs={e => handleDocs(
								completion.documentation,
								e.detail)
							}
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
						on:click={() => {
							$selectedForm.machine.send(
								'QUERY_EXECUTED'
							);
							// routeMachine.send('REQUESTED');
						}}
						class='query-button'
					>Run query</button>
				{:else if $formMachine && $formMachine.matches({
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
							on:change={e =>
								routeMachine.send(
									'AUTO_EXEC_TOGGLED',
									e.target.checked)
							}
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
						on:click={() => {
							$selectedForm.machine.send(
								'QUERY_EXECUTED'
							);
							// routeMachine.send('REQUESTED');
						}}
						class='query-button'
					>Run query</button>
				{/if}
				<PanelMenu position='static' className='query-menu' popup='top'>
					<MenuItem>
						<input
							checked={$runQueryOnSelect}
							on:change={e =>
								routeMachine.send(
									'AUTO_EXEC_TOGGLED',
									e.target.checked)
							}
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
					on:change={e =>
						routeMachine.send(
							'SHOW_FULL_RESPONSE_TOGGLED',
							e.target.checked
						)
					}
					id='showFullResponseID'
					type='checkbox'
				>
				<label
					class='clickable'
					for='showFullResponseID'
				>Show full response</label>
			</MenuItem>
		</PanelMenu>

		<header class='bold'>Response</header>
		<div class='json'>
			{#if $formMachine}
			{#if $formMachine.matches({
				SelectionComplete: {
					QueryReady: {
						Dirty: "Pending"
					}
				}
			})}
				Waiting for response...
			{/if}
			{#if $formMachine.matches({
				SelectionComplete: {
					QueryReady: "Matching"
				}
			})}
				<JSONValue
					value={$showFullResponse
						? $response
						: $response.aggregations
					}
				/>

			{/if}
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
	section > section > section > header {
		font-size: 1em;
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
</style>
