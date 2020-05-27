<script context='module'>
    import DATASETS from 'app/data/datasets.json';
    import {
        descriptionsEN,
        aggregationsPerType,
        determineESType,
        buildAggregation
	} from 'app/elasticsearch';
	import { request } from 'app/net';

    //const matrixDimensions = ['aggregations', 'types', 'fields', 'datasets'];
    const crossIndex = {
        aggregations: {},
        types: {},
        fields: {},
        datasets: {}
    };
    /*
    for (let dim of matrixDimensions) {
        crossIndex[dim] = {};
        //Object.fromEntries(matrixDimensions.filter(i => dim !== i).map(i => ([i, []])));
    }
    */

    const fieldNamesSet = new Set;
    const typeNamesSet = new Set;
    for (let i in DATASETS) {
        const dataset = DATASETS[i];
        const newDataset = {
            aggregations: new Set,
            types: new Set,
            fields: new Set,
            index: i
        };
        crossIndex.datasets[dataset.id] = newDataset;

        const schema = dataset.spec.dataset.schema;
        for(let fieldName in schema) {
            fieldNamesSet.add(fieldName);
            newDataset.fields.add(fieldName);

            const fieldType = determineESType(schema[fieldName]);
            typeNamesSet.add(fieldType)
            newDataset.types.add(fieldType);

            const aggs = aggregationsPerType[fieldType]
            if (aggs)
                aggs.forEach(a => {
                    newDataset.aggregations.add(a);
                    //crossIndex.aggregations[a].datasets.add(dataset.id);
                });
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
            fields: new Set
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
                .map(dsName => determineESType(DATASETS[crossIndex.datasets[dsName].index].spec.dataset.schema[f]))
        );
        const aggregations = new Set;
        for (let t of types) {
            //console.log(t)
            const aggs = aggregationsPerType[t];
            if (aggs)
                aggs.forEach( agg => aggregations.add(agg) );
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

    //console.log(crossIndex);
</script>

<script>
    import JSONValue from 'app/components/JSONValue.svelte';
    import Select from 'app/components/Select.svelte';

    let queryConfig = {
        dataset: 'none',
        axes: {
            main: {
                aggregation: 'none',
                type: 'none',
                field: 'none'
            },
            secondary: {
                aggregation: 'none',
                type: 'none',
                field: 'none'
            }
        }
    };

    let queryTemplate = {};

    const axisOptions = [
        {
            text: 'Main',
            value: 'main',
            disabled: false
        },
        {
            text: 'Secondary',
            value: 'secondary',
            disabled: false
        }
    ];
    let aggregatorOptions = [];
    let typeOptions = [];
    let datasetOptions = [];
    let fieldOptions = [];

    let selectedAxis = 'main';
    let selectedAxisConfig;

    let readyForRequest = false;

    let responsePromise;

    function verify(k, indexName) {
        const index = crossIndex[indexName+'s'];
        // index[t][selectedAxisConfig[t]])
        //console.log(selectedAxisConfig)
        Object.keys(index)
            .every(t => console.log(t));
    }
    function computeLists() {
        let selectedAgg = selectedAxisConfig.aggregation 
        if (selectedAgg !== 'none') {

        }
        aggregatorOptions = Object.keys(descriptionsEN).map(k => ({
            text: descriptionsEN[k],
            value: k,
            disabled: 
                (selectedAxisConfig.type === 'none'? false : !crossIndex.types[selectedAxisConfig.type].aggregations.has(k))
                || (queryConfig.dataset === 'none'? false : !crossIndex.datasets[DATASETS[queryConfig.dataset].id].aggregations.has(k))
                || (selectedAxisConfig.field === 'none'? false : !crossIndex.fields[selectedAxisConfig.field].aggregations.has(k))
        }));
        typeOptions = Object.keys(crossIndex.types).map(k => ({
            text: k,
            value: k,
            disabled: 
                (selectedAxisConfig.aggregation === 'none'? false : !crossIndex.aggregations[selectedAxisConfig.aggregation].types.has(k))
                || (queryConfig.dataset === 'none'? false : !crossIndex.datasets[DATASETS[queryConfig.dataset].id].types.has(k))
                || (selectedAxisConfig.field === 'none'? false : !crossIndex.fields[selectedAxisConfig.field].types.has(k))
        }));
        datasetOptions = DATASETS.map((k, i) => ({
            text: k.id,
            value: i,
            disabled: 
                (selectedAxisConfig.type === 'none'? false : !crossIndex.types[selectedAxisConfig.type].datasets.has(k.id))
                || (selectedAxisConfig.field === 'none'? false : !crossIndex.fields[selectedAxisConfig.field].datasets.has(k.id))
                || (selectedAxisConfig.aggregation === 'none'? false : !crossIndex.aggregations[selectedAxisConfig.aggregation].datasets.has(k.id))
        }));
        fieldOptions = fieldNames.map( f => ({
            text: f,
            value: f,
            disabled: 
                (selectedAxisConfig.type === 'none'? false : !crossIndex.types[selectedAxisConfig.type].fields.has(f))
                || (queryConfig.dataset === 'none'? false : !crossIndex.datasets[DATASETS[queryConfig.dataset].id].fields.has(f))
                || (selectedAxisConfig.aggregation === 'none'? false : !crossIndex.aggregations[selectedAxisConfig.aggregation].fields.has(f))
        }));

        const main = queryConfig.axes.main;
        readyForRequest = false;
        queryTemplate = {
            size: 0
        }
        if (queryConfig.dataset !== 'none' && main.aggregation !== 'none' && main.field !== 'none') {
            readyForRequest = true;
            const fieldInfo = DATASETS[queryConfig.dataset].spec.dataset.schema[main.field];
            queryTemplate.aggs= {
                mainAxis: {
                    [main.aggregation]: buildAggregation(main.aggregation, main.field, fieldInfo)
                }
            };
            const secondary = queryConfig.axes.secondary;
            if (secondary.aggregation !== 'none' && secondary.field !== 'none') {
                const fieldInfo = DATASETS[queryConfig.dataset].spec.dataset.schema[secondary.field];
                queryTemplate.aggs.mainAxis.aggs = {
                    secondaryAxis: {
                        [secondary.aggregation]: buildAggregation(secondary.aggregation, secondary.field, fieldInfo)
                    }
                };
            }
        }
    }

	function doQuery() {
		const endpoint = DATASETS[queryConfig.dataset].spec.dataset.endpoint_url;
		const url = `${endpoint}/_search`;
		responsePromise = request(fetch, 'POST', url, {data: queryTemplate});
	}

    $: selectedAxisConfig = queryConfig.axes[selectedAxis];
    $: computeLists(queryConfig);
</script>

<section class="query-builder">
    <section class='axes'>
        <header>Axes</header>
        <Select options={axisOptions} bind:selectedOption={selectedAxis} unselectable={false} />
    </section>

    <section class='agreggations'>
        <header>Aggregations</header>
        <Select options={aggregatorOptions} bind:selectedOption={selectedAxisConfig.aggregation} />
    </section>

    <section class='types'>
        <header>Types</header>
        <Select options={typeOptions} bind:selectedOption={selectedAxisConfig.type} />
    </section>

    <section class='datasets'>
        <header>Datasets</header>
        <Select options={datasetOptions} bind:selectedOption={queryConfig.dataset} />
    </section>

    <section class='fields'>
        <header>Fields</header>
        <Select options={fieldOptions} bind:selectedOption={selectedAxisConfig.field} />
    </section>

    <section class='request'>
        <header>Request</header>
        <div class='json'>
            <JSONValue value={queryTemplate} />
        </div>
        <button disabled={!readyForRequest} on:click={doQuery}>Execute</button>
    </section>

    <section class='response'>
        <header>Response</header>
        <div class='json'>
            {#if responsePromise}
                {#await responsePromise}
                    waiting for response...
                {:then response}
                    <JSONValue value={response} />
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
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-template-rows: 0.5fr 0.5fr;
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
        grid-template-areas: "header" "select";
        grid-template-rows: min-content auto min-content;
    }

    header { grid-area: header; }
</style>