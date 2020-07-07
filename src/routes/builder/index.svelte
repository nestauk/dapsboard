<script context='module'>
	import { getCompletions } from 'app/tsservices';
	import * as _ from 'lamb';
	// eslint-disable-next-line node/no-extraneous-import
	import {capitalise} from 'svizzle/utils/string-string';

	import DATASETS from 'app/data/datasets.json';
	import {
		metricLabels,
		bucketLabels,
		aggsByType,
	} from 'app/elasticsearch/config';
	import {
		getESType,
		buildAggregation
	} from 'app/elasticsearch';
	import { request } from 'app/net';
	import {
		getEndpointURL,
		getSchema,
		IS_BROWSER
	} from 'app/utils';

	const aggregations = {};
	const datasets = {};
	const fields = {};
	const types = {};

	const fieldNamesSet = new Set();
	const typeNamesSet = new Set();

	for (let index in DATASETS) {
		const dataset = DATASETS[index];
		const newDataset = {
			aggregations: new Set(),
			types: new Set(),
			fields: new Set(),
			index
		};
		datasets[dataset.id] = newDataset;

		const schema = getSchema(dataset);
		for (let field in schema) {
			fieldNamesSet.add(field);
			newDataset.fields.add(field);

			const esType = getESType(schema[field]);
			typeNamesSet.add(esType)
			newDataset.types.add(esType);

			const aggs = aggsByType[esType]
			if (aggs) {
				aggs.forEach(agg => {
					newDataset.aggregations.add(agg);
				})
			}
		}
	}

	const typeNames = Array.from(typeNamesSet).sort();
	for (let esType of typeNames) {
		types[esType] = {
			aggregations: new Set(aggsByType[esType]),
			datasets: new Set(
				Object.keys(datasets)
				.filter(dsName => datasets[dsName].types.has(esType))
			),
			fields: new Set()
		}
	}

	const fieldNames = Array.from(fieldNamesSet).sort();
	for (let field of fieldNames) {
		const _datasets = new Set(
			Object.keys(datasets)
			.filter(dsName => datasets[dsName].fields.has(field))
		)
		const _types = new Set(
			Object.keys(datasets)
			.filter(dsName => datasets[dsName].fields.has(field))
			.map(dsName => getESType(getSchema(DATASETS[datasets[dsName].index])[field]))
		);
		const _aggregations = new Set();
		for (let esType of _types) {
			const aggs = aggsByType[esType];
			if (aggs) {
				aggs.forEach(agg => _aggregations.add(agg));
			}
			types[esType].fields.add(field);
		}
		fields[field] = {
			datasets: _datasets,
			types: _types,
			aggregations: _aggregations
		};
	}

	for (let agg of Object.keys(metricLabels)) {
		aggregations[agg] = {
			types: new Set(
				Object.keys(types)
				.filter(esType => types[esType].aggregations.has(agg))
			),
			datasets: new Set(
				Object.keys(datasets)
				.filter(dsName => datasets[dsName].aggregations.has(agg))
			),
			fields: new Set(
				Object.keys(fields)
				.filter(field => fields[field].aggregations.has(agg))
			)
		}
	}

	for (let agg of Object.keys(bucketLabels)) {
		aggregations[agg] = {
			types: new Set(
				Object.keys(types)
				.filter(esType => types[esType].aggregations.has(agg))
			),
			datasets: new Set(
				Object.keys(datasets)
				.filter(dsName => datasets[dsName].aggregations.has(agg))
			),
			fields: new Set(
				Object.keys(fields)
				.filter(field => fields[field].aggregations.has(agg))
			)
		}
	}
</script>

<script>
	import JSONValue from 'app/components/JSONValue.svelte';
	import ESField from 'app/components/elementary/ElasticSearchField.svelte';

	import TabContainer from 'app/components/elementary/TabContainer.svelte';
	import Tab from 'app/components/elementary/Tab.svelte';
	import Select from 'app/components/elementary/Select.svelte';
	import SelectMenu from 'app/components/elementary/SelectMenu.svelte';
	import PanelMenu from 'app/components/elementary/PanelMenu.svelte';
	import MenuItem from 'app/components/elementary/MenuItem.svelte';
	import IconDelete from 'app/components/icons/IconDelete.svelte';

	let datasetTypings;
	const AXIS_NAMES = [
		'primary',
		'secondary',
		'tertiary',
		'quaternary',
		'quinary',
		'senary',
		'septenary',
		'octonary',
		'nonary',
		'denary'
	];

	let resultSize = 0;

	let queryConfig = {
		dataset: undefined,
		axes: _.fromPairs(AXIS_NAMES.map(name =>
			[name, {
				aggregation: null,
				type: null,
				field: null,
			}]
		))
	};

	let axisParams = _.fromPairs(AXIS_NAMES.map(name =>
		[name, {
			input: {},
			pureOutput: null,
			output: null
		}]
	));

	let queryTemplate = {};
	let parsedQuery = queryTemplate;

	let axisOptions = AXIS_NAMES.map(name => ({
		text: capitalise(name),
		value: name,
		disabled: true
	}));

	let bucketOptions = [];
	let aggregatorOptions = [];
	let typeOptions = [];
	let datasetOptions = [];
	let fieldOptions = [];

	let [ selectedAxis ] = AXIS_NAMES;
	let selectedAxisConfig = queryConfig.axes[selectedAxis];
	let selectedParams;

	let readyForRequest = false;

	let responsePromise;

	let hideDisabledAxes = true;
	let hideDisabledDatasets = false;
	let hideDisabledAggregations = false;
	let hideDisabledFields = true;

	let showFullResponse = false;
	let runQueryOnSelect = true;

	let selectedFieldCompletions = [];

	let selectedRequestTab;

	/*
	function resetAxis (axis) {
		queryConfig.axes[axis] = {
			aggregation: null,
			type: null,
			field: null
		};
		axisParams[axis] = {
			input: {},
			pureOutput: null,
			output: null
		}
	}
	*/

	function cleanRequestBody () {
		readyForRequest = false;
		queryTemplate = {
			size: resultSize
		}
	}
	function clearParameters () {
		selectedParams.input = {};
	}

	const isMissing = (key, value) => obj => Boolean(obj)
		&& !obj[key].has(value);

	function computeRequestBody (config) {
		cleanRequestBody();

		let activeAxes = 0;
		let currentTemplate = queryTemplate;
		let active = true;
		let includedInQuery = true;
		readyForRequest = false;
		while (active) {
			active = false;
			const currentName = AXIS_NAMES[activeAxes++];
			const currentAxis = config.axes[currentName];
			const currentParams = axisParams[currentName];
			currentParams.output = null;
			if (Boolean(currentAxis.aggregation)
				&& Boolean(currentAxis.field)
			) {
				if (activeAxes < AXIS_NAMES.length) {
					active = true;
				}
				if (config.dataset && includedInQuery) {
					readyForRequest = true;
					const fieldInfo
						= getSchema(DATASETS[config.dataset])[currentAxis.field];
					const agg = buildAggregation(
						currentAxis.aggregation,
						currentAxis.field,
						fieldInfo
					);
					currentParams.pureOutput = {
						[currentName]: {
							[currentAxis.aggregation]: agg
						}
					};
					currentParams.output = {
						[currentName]: {
							[currentAxis.aggregation]: {
								...agg,
								...currentParams.input
							}
						}
					};
					currentTemplate.aggs = {...currentParams.output};
					currentTemplate = currentTemplate.aggs[currentName];
				}
				if (currentName === selectedAxis) {
					includedInQuery = false;
				}
			}
		}
		return activeAxes;
	}

	async function computeLists (config) {
		const typeDicts = types[selectedAxisConfig.type];
		const fieldDicts = fields[selectedAxisConfig.field];
		const datasetDicts = config.dataset
			&& datasets[DATASETS[config.dataset].id];
		const aggDicts = aggregations[selectedAxisConfig.aggregation];

		bucketOptions = Object.keys(bucketLabels).map(agg => ({
			text: bucketLabels[agg],
			value: agg,
			disabled: [typeDicts, datasetDicts, fieldDicts]
			.some(isMissing('aggregations', agg))
		}));
		aggregatorOptions = Object.keys(metricLabels).map(agg => ({
			text: metricLabels[agg],
			value: agg,
			disabled: [typeDicts, datasetDicts, fieldDicts]
			.some(isMissing('aggregations', agg))
		}));
		typeOptions = Object.keys(types).map(type => ({
			text: type,
			value: type,
			disabled: false,
			effaced: [aggDicts, datasetDicts, fieldDicts]
			.some(isMissing('types', type))
		}));
		datasetOptions = DATASETS.map((dataset, index) => ({
			text: dataset.id,
			value: index,
			disabled: [typeDicts, fieldDicts, aggDicts]
			.some(isMissing('datasets', dataset.id))
		}));
		fieldOptions = fieldNames.map(field => ({
			text: field,
			value: field,
			disabled:
				!config.dataset
				|| [typeDicts, datasetDicts, aggDicts]
				.some(isMissing('fields', field))
		}));

		let activeAxes = computeRequestBody(config);

		if (typeOptions.some(i => i.effaced
			&& i.value === selectedAxisConfig.type)) {
			cleanRequestBody();
		}

		axisOptions.forEach((o,i) => {
			o.disabled = i >= activeAxes
		});
		axisOptions = axisOptions;
		responsePromise = Promise.resolve(undefined);

		if (IS_BROWSER && window.ts && selectedParams.output) {
			const ds = DATASETS[config.dataset].id;
			const code = `
				const selection: Aggs<${ds}, '${selectedAxisConfig.field}'> = 
					${JSON.stringify(selectedParams.pureOutput)};
			`;
			if (!datasetTypings) {
				datasetTypings = await request(
					'GET',
					'dsl/datasets.ts',
					{type:'text'}
				);
			}
			const fullCode = datasetTypings + code;
			selectedFieldCompletions = getCompletions(
				fullCode,
				fullCode.lastIndexOf('{') + 1
			).sort((a, b) => b.required - a.required);
		}
	}

	function getFieldValue (name) {
		return selectedParams.input[name]
			|| selectedParams
			.output[selectedAxis][selectedAxisConfig.aggregation][name];
	}

	function updateField (name, newValue) {
		// TODO For text types, should we distinguish between
		// empty strings and `null` or `undefined`?
		if (newValue !== null) {
			selectedParams.input[name] = newValue;
		}
		else {
			delete selectedParams.input[name];
		}
		computeRequestBody(queryConfig);
	}

	const cache = {};
	function doQuery (query) {
		if (readyForRequest) {
			const endpoint = getEndpointURL(DATASETS[queryConfig.dataset]);
			const url = `${endpoint}/_search`;
			const cacheKey = `${url}/${JSON.stringify(query)}`;
			if (cacheKey in cache) {
				responsePromise = Promise.resolve(cache[cacheKey]);
			} else {
				responsePromise = request('POST', url, {data: query});
				responsePromise.then(json => {
					cache[cacheKey] = json;
				});
			}
		}
	}

	function axisChanged (newAxis) {
		selectedAxisConfig = queryConfig.axes[newAxis];
		selectedParams = axisParams[newAxis];
	}

	$: axisChanged(selectedAxis);
	$: !queryConfig.dataset && (selectedAxisConfig.field = null);
	// eslint-disable-next-line no-unused-expressions, no-sequences
	// $: queryConfig[selectedAxis], queryConfig.dataset, clearParameters();
	$: computeLists(queryConfig);
	// eslint-disable-next-line no-unused-expressions, no-sequences
	$: $selectedRequestTab === 'fields'
		&& runQueryOnSelect
		&& doQuery(queryTemplate);
	$: $selectedRequestTab === 'request'
		&& runQueryOnSelect
		&& doQuery(parsedQuery);
</script>

<section class="query-builder">
	<section class='axes'>
		<SelectMenu bind:hideDisabled={hideDisabledAxes} />
		<header class='bold'>Axes</header>
		<Select
			bind:selectedOption={selectedAxis}
			hideDisabled={hideDisabledAxes}
			let:option={option}
			options={axisOptions}
			unselectable={false}
		>
			<div class='axis-item'>
				<div>{option.text}</div>
				<div >
					<IconDelete size={14} />
				</div>
			</div>
		</Select>
	</section>

	<section class='agreggations'>
		<SelectMenu bind:hideDisabled={hideDisabledAggregations} />
		<header class='bold'>Aggregations</header>
		<section>
			<header class='semibold'>Bucketing</header>
			<Select
				bind:selectedOption={selectedAxisConfig.aggregation}
				hideDisabled={hideDisabledAggregations}
				options={bucketOptions}
				on:selectionChanged={clearParameters}
				/>
			<header class='semibold'>Metrics</header>
			<Select
				bind:selectedOption={selectedAxisConfig.aggregation}
				hideDisabled={hideDisabledAggregations}
				options={aggregatorOptions}
				on:selectionChanged={clearParameters}
				/>
		</section>
	</section>

	<section class='types'>
		<header class='bold'>Types</header>
		<Select
			bind:selectedOption={selectedAxisConfig.type}
			options={typeOptions}
			on:selectionChanged={clearParameters}
		/>
	</section>

	<section class='datasets'>
		<SelectMenu bind:hideDisabled={hideDisabledDatasets} />
		<header class='bold'>Datasets</header>
		<Select
			bind:selectedOption={queryConfig.dataset}
			hideDisabled={hideDisabledDatasets}
			options={datasetOptions}
			on:selectionChanged={clearParameters}
		/>
	</section>

	<section class='fields'>
		<SelectMenu bind:hideDisabled={hideDisabledFields} />
		<header class='bold'>Fields</header>
		<Select
			bind:selectedOption={selectedAxisConfig.field}
			hideDisabled={hideDisabledFields}
			options={fieldOptions}
			on:selectionChanged={clearParameters}
		/>
	</section>

	<TabContainer
		className='request'
		bind:selectedTab={selectedRequestTab}
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
					value={resultSize}
					on:change={e => {
						resultSize = e.detail;
						computeRequestBody(queryConfig);
					}}
					
				/>
				{#if selectedParams.output}
					{#each selectedFieldCompletions as completion}
						{#if completion.name !== 'field'}
							<ESField
								labelText={completion.name}
								required={completion.required}
								dataType={completion.displayText}
								value={getFieldValue(completion.name)}
								on:change={e => {
									updateField(completion.name, e.detail);
								}}
							/>
						{/if}
					{/each}
				{/if}
			</div>
			<div class='query-bottom'>
				{#if !runQueryOnSelect}
					<button
						disabled={!readyForRequest}
						on:click={() => doQuery(queryTemplate)}
						class='query-button'
					>Run query</button>
				{:else if readyForRequest}
					<div class='query-button'>
						Press Enter or Tab to run the query
					</div>
				{/if}
				<PanelMenu position='static' className='query-menu' popup='top'>
					<MenuItem>
						<input
							bind:checked={runQueryOnSelect}
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
				value={queryTemplate}
				bind:parsedValue={parsedQuery}
			/>
			<div class='query-bottom'>
				{#if !runQueryOnSelect}
					<button 
						disabled={!readyForRequest} 
						on:click={() => doQuery(parsedQuery)}
						class='query-button'
					>Run query</button>
				{/if}
				<PanelMenu position='static' className='query-menu' popup='top'>
					<MenuItem>
						<input
							bind:checked={runQueryOnSelect}
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
					bind:checked={showFullResponse}
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
			{#if responsePromise}
				{#await responsePromise}
					Waiting for response...
				{:then response}
					<JSONValue
						value={showFullResponse
							? response
							: response && response.aggregations}
					/>
				{:catch error}
					<JSONValue value={error.jsonMessage} />
				{/await}
			{/if}
		</div>
	</section>

</section>

<style>
	.query-builder {
		height: 100%;
		display: grid;
		grid-template-areas:
			"axes agreggations types datasets fields request"
			"axes agreggations types datasets fields response";
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

	.axis-item {
		display: grid;
		grid-template-columns: 1fr min-content;
		grid-column-gap: 1em;
	}

	.query-bottom {
		display: grid;
		grid-template-columns: auto min-content;
		padding-top: 1em;
	}
	.query-button {
		padding: 0.4em;
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
		padding:0.4em 0 0.4em 1em;
	}
</style>
