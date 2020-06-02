<script context='module'>
	import * as _ from 'lamb';

	import DATASETS from 'app/data/datasets.json';
	import {
		descriptionsEN,
		bucketDescriptionsEN,
		aggregationsPerType,
		determineESType,
		buildAggregation
	} from 'app/elasticsearch';
	import { request } from 'app/net';
	import {
		getEndpointURL,
		getSchema,
		capitalize
	} from 'app/utils';

	const crossIndex = {
		aggregations: {},
		types: {},
		fields: {},
		datasets: {}
	};

	const fieldNamesSet = new Set();
	const typeNamesSet = new Set();
	for (let i in DATASETS) {
		const dataset = DATASETS[i];
		const newDataset = {
			aggregations: new Set(),
			types: new Set(),
			fields: new Set(),
			index: i
		};
		crossIndex.datasets[dataset.id] = newDataset;

		const schema = getSchema(dataset);
		for (let fieldName in schema) {
			fieldNamesSet.add(fieldName);
			newDataset.fields.add(fieldName);

			const fieldType = determineESType(schema[fieldName]);
			typeNamesSet.add(fieldType)
			newDataset.types.add(fieldType);

			const aggs = aggregationsPerType[fieldType]
			if (aggs) {
				aggs.forEach(a => {
					newDataset.aggregations.add(a);
				})
			}
		}
	}

	const typeNames = Array.from(typeNamesSet).sort();
	for (let type of typeNames) {
		crossIndex.types[type] = {
			aggregations: new Set(aggregationsPerType[type]),
			datasets: new Set(
				Object.keys(crossIndex.datasets)
					.filter(dsName => crossIndex.datasets[dsName].types.has(type))
					.map(dsName => dsName)
			),
			fields: new Set()
		}
	}

	const fieldNames = Array.from(fieldNamesSet).sort();
	for (let f of fieldNames) {
		const datasets = new Set(
			Object.keys(crossIndex.datasets)
				.filter(dsName => crossIndex.datasets[dsName].fields.has(f))
				.map(dsName => dsName)
		)
		const types = new Set(
			Object.keys(crossIndex.datasets)
				.filter(dsName => crossIndex.datasets[dsName].fields.has(f))
				.map(dsName => determineESType(getSchema(DATASETS[crossIndex.datasets[dsName].index])[f]))
		);
		const aggregations = new Set();
		for (let t of types) {
			const aggs = aggregationsPerType[t];
			if (aggs) {
				aggs.forEach(agg => aggregations.add(agg));
			}
			crossIndex.types[t].fields.add(f);
		}
		crossIndex.fields[f] = {
			datasets,
			types,
			aggregations
		};
	}

	for (let agg of Object.keys(descriptionsEN)) {
		crossIndex.aggregations[agg] = {
			types: new Set(
				Object.keys(crossIndex.types)
					.filter(typeName => crossIndex.types[typeName].aggregations.has(agg))
					.map(typeName => typeName)
			),
			datasets: new Set(
				Object.keys(crossIndex.datasets)
					.filter(dsName => crossIndex.datasets[dsName].aggregations.has(agg))
					.map(dsName => dsName)
			),
			fields: new Set(
				Object.keys(crossIndex.fields)
					.filter(fieldName => crossIndex.fields[fieldName].aggregations.has(agg))
					.map(fieldName => fieldName)
			)
		}
	}

	for (let agg of Object.keys(bucketDescriptionsEN)) {
		crossIndex.aggregations[agg] = {
			types: new Set(
				Object.keys(crossIndex.types)
					.filter(typeName => crossIndex.types[typeName].aggregations.has(agg))
					.map(typeName => typeName)
			),
			datasets: new Set(
				Object.keys(crossIndex.datasets)
					.filter(dsName => crossIndex.datasets[dsName].aggregations.has(agg))
					.map(dsName => dsName)
			),
			fields: new Set(
				Object.keys(crossIndex.fields)
					.filter(fieldName => crossIndex.fields[fieldName].aggregations.has(agg))
					.map(fieldName => fieldName)
			)
		}
	}

	// console.log(crossIndex);
</script>

<script>
	import JSONValue from 'app/components/JSONValue.svelte';
	import Select from 'app/components/Select.svelte';
	import SelectMenu from 'app/components/SelectMenu.svelte';
	import PanelMenu from 'app/components/elementary/PanelMenu.svelte';
	import MenuItem from 'app/components/elementary/MenuItem.svelte';
	import IconDelete from 'app/components/icons/IconDelete.svelte';

	const AXIS_NAMES = ['primary', 'secondary', 'tertiary', 'quaternary', 'quinary', 'senary', 'septenary', 'octonary', 'nonary', 'denary'];
	let queryConfig = {
		dataset: undefined,
		axes: _.fromPairs(AXIS_NAMES.map(q => [q, {
			aggregation: undefined,
			type: undefined,
			field: undefined
		}]))
	};

	let queryTemplate = {};
	let parsedQuery = queryTemplate;

	let axisOptions = AXIS_NAMES.map(name => ({
		text: capitalize(name),
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

	let readyForRequest = false;

	let responsePromise;

	let hideDisabledAxes = true;
	let hideDisabledDatasets = false;
	let hideDisabledAggregations = false;
	let hideDisabledFields = true;

	let showFullResponse = false;

	function resetAxis (axis) {
		queryConfig.axes[axis] = {
			aggregation: undefined,
			type: undefined,
			field: undefined
		};
	}

	function computeLists (config) {
		bucketOptions = Object.keys(bucketDescriptionsEN).map(k => ({
			text: bucketDescriptionsEN[k],
			value: k,
			disabled:
				(selectedAxisConfig.type === undefined ? false : !crossIndex.types[selectedAxisConfig.type].aggregations.has(k))
				|| (config.dataset === undefined ? false : !crossIndex.datasets[DATASETS[config.dataset].id].aggregations.has(k))
				|| (selectedAxisConfig.field === undefined ? false : !crossIndex.fields[selectedAxisConfig.field].aggregations.has(k))
		}));
		aggregatorOptions = Object.keys(descriptionsEN).map(k => ({
			text: descriptionsEN[k],
			value: k,
			disabled:
				(selectedAxisConfig.type === undefined ? false : !crossIndex.types[selectedAxisConfig.type].aggregations.has(k))
				|| (config.dataset === undefined ? false : !crossIndex.datasets[DATASETS[config.dataset].id].aggregations.has(k))
				|| (selectedAxisConfig.field === undefined ? false : !crossIndex.fields[selectedAxisConfig.field].aggregations.has(k))
		}));
		typeOptions = Object.keys(crossIndex.types).map(k => ({
			text: k,
			value: k,
			disabled: false,
			effaced:
				(selectedAxisConfig.aggregation === undefined ? false : !crossIndex.aggregations[selectedAxisConfig.aggregation].types.has(k))
				|| (config.dataset === undefined ? false : !crossIndex.datasets[DATASETS[config.dataset].id].types.has(k))
				|| (selectedAxisConfig.field === undefined ? false : !crossIndex.fields[selectedAxisConfig.field].types.has(k))
		}));
		datasetOptions = DATASETS.map((k, i) => ({
			text: k.id,
			value: i,
			disabled:
				(selectedAxisConfig.type === undefined ? false : !crossIndex.types[selectedAxisConfig.type].datasets.has(k.id))
				|| (selectedAxisConfig.field === undefined ? false : !crossIndex.fields[selectedAxisConfig.field].datasets.has(k.id))
				|| (selectedAxisConfig.aggregation === undefined ? false : !crossIndex.aggregations[selectedAxisConfig.aggregation].datasets.has(k.id))
		}));
		fieldOptions = fieldNames.map(f => ({
			text: f,
			value: f,
			disabled:
				!config.dataset
				|| (selectedAxisConfig.type === undefined ? false : !crossIndex.types[selectedAxisConfig.type].fields.has(f))
				|| (config.dataset === undefined ? false : !crossIndex.datasets[DATASETS[config.dataset].id].fields.has(f))
				|| (selectedAxisConfig.aggregation === undefined ? false : !crossIndex.aggregations[selectedAxisConfig.aggregation].fields.has(f))
		}));

		readyForRequest = false;
		queryTemplate = {
			size: 0
		}
		let activeAxes = 0;
		let currentTemplate = queryTemplate;
		let active = true;
		while (active) {
			active = false;
			const currentName = AXIS_NAMES[activeAxes++];
			const current = config.axes[currentName];
			if (current.aggregation !== undefined && current.field !== undefined) {
				if (activeAxes < AXIS_NAMES.length) {
					active = true;
				}
				readyForRequest = true;
				if (config.dataset) {
					const fieldInfo = getSchema(DATASETS[config.dataset])[current.field];
					currentTemplate.aggs = {
						[currentName]: {
							[current.aggregation]: buildAggregation(current.aggregation, current.field, fieldInfo)
						}
					};
					currentTemplate = currentTemplate.aggs[currentName];
				}
			}
		}

		if (typeOptions.some(i => i.effaced && i.value === selectedAxisConfig.type)) {
			queryTemplate = {
				size: 0
			}
		}


		axisOptions.forEach((o,i) => {
			o.disabled = i >= activeAxes
		});
		axisOptions = axisOptions;
		responsePromise = Promise.resolve(undefined);
	}

	function doQuery () {
		const endpoint = getEndpointURL(DATASETS[queryConfig.dataset]);
		const url = `${endpoint}/_search`;
		responsePromise = request(fetch, 'POST', url, {data: parsedQuery});
	}

	$: selectedAxisConfig = queryConfig.axes[selectedAxis];
	$: computeLists(queryConfig);
</script>

<section class="query-builder">
	<section class='axes'>
		<SelectMenu bind:hideDisabled={hideDisabledAxes} />
		<header>Axes</header>
		<Select
			bind:selectedOption={selectedAxis}
			hideDisabled={hideDisabledAxes}
			let:option={option}
			options={axisOptions}
			unselectable={false}
		>
			<div class='axis-item'>
				<div>{option.text}</div>
				<div on:click={resetAxis(option.value)}>
					<IconDelete size={14} />
				</div>
			</div>
		</Select>
	</section>

	<section class='agreggations'>
		<SelectMenu bind:hideDisabled={hideDisabledAggregations} />
		<header>Aggregations</header>
		<section>
			<header>Bucketing</header>
			<Select options={bucketOptions} bind:selectedOption={selectedAxisConfig.aggregation} hideDisabled={hideDisabledAggregations} />
			<header>Metrics</header>
			<Select options={aggregatorOptions} bind:selectedOption={selectedAxisConfig.aggregation} hideDisabled={hideDisabledAggregations} />
		</section>
	</section>

	<section class='types'>
		<header>Types</header>
		<Select options={typeOptions} bind:selectedOption={selectedAxisConfig.type} />
	</section>

	<section class='datasets'>
		<SelectMenu bind:hideDisabled={hideDisabledDatasets} />
		<header>Datasets</header>
		<Select options={datasetOptions} bind:selectedOption={queryConfig.dataset}  hideDisabled={hideDisabledDatasets}  />
	</section>

	<section class='fields'>
		<SelectMenu bind:hideDisabled={hideDisabledFields} />
		<header>Fields</header>
		<Select options={fieldOptions} bind:selectedOption={selectedAxisConfig.field} hideDisabled={hideDisabledFields} />
	</section>

	<section class='request'>
		<header>Request</header>
		<div class='json'>
			<JSONValue value={queryTemplate} editable={true} bind:parsedValue={parsedQuery}/>
		</div>
		<button disabled={!readyForRequest} on:click={doQuery}>Execute</button>
	</section>

	<section class='response'>
		<PanelMenu>
			<MenuItem>
				<input type='checkbox' bind:checked={showFullResponse} id='showFullResponseID'> <label for='showFullResponseID'>Show full response</label>
			</MenuItem>
		</PanelMenu>

		<header>Response</header>
		<div class='json'>
			{#if responsePromise}
				{#await responsePromise}
					waiting for response...
				{:then response}
					<JSONValue value={showFullResponse ? response : response && response.aggregations} />
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
		grid-template-columns: fit-content(100%) fit-content(100%) fit-content(100%) fit-content(100%) fit-content(100%)  1fr;
		grid-template-rows: 0.5fr 0.5fr;
		grid-gap: 1em;
		background: #DDD;
		padding: 1em;
	}
	.axes {grid-area: axes;}
	.agreggations {grid-area: agreggations;}
	.types {grid-area: types;}
	.datasets {grid-area: datasets;}
	.fields {grid-area: fields;}
	.request {grid-area: request;}
	.response {grid-area: response;}

	.axes,
	.agreggations,
	.types,
	.datasets,
	.fields,
	.request,
	.response {
		display: grid;
		background: white;
		grid-template-areas: "header" "select";
		grid-template-rows: min-content auto min-content;
		overflow: hidden;
		box-sizing: border-box;
		height: 100%;
		box-shadow: .2em .2em .4em #8888;
		padding: 1em;
		position: relative;
		min-width: 7em;
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
</style>
