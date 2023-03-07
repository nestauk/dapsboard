<script>
	import * as _ from 'lamb';

	import {
		getCompoundValueAggs,
		getChartedAggs,
		getSingleValueAggs,
	} from '$lib/app/utils/resultsMapper.js';

	import AggResultView from './AggResultView.svelte';

	export let aggs;
	export let title;

	const getTitle = path => {
		if (path.length === 1) {
			return path[0].aggId;
		}
		const [f, l] = path;
		return `${l.fieldName} : ${l.aggId} by ${f.fieldName} : ${f.aggId}`;
	}

	$: aggs = aggs || [];
	$: title = title || '';

	$: singleValueAggs = getSingleValueAggs(aggs);
	$: compoundValueAggs = getCompoundValueAggs(aggs);
	$: chartedAggs = getChartedAggs(aggs);
</script>

<section class='FieldsAggsDisplay'>
	<div class='aggs single_values'>
		{#each singleValueAggs as {path, result}}
			<AggResultView
				meta={path[0]}
				{result}
				title={getTitle(path)}
			/>
		{/each}
	</div>

	<div class='aggs compound_values'>
		{#each compoundValueAggs as {path, result}}
			<AggResultView
				meta={path[0]}
				{result}
				title={getTitle(path)}
			/>
		{/each}
	</div>

	<div class='aggs charts'>
		{#each chartedAggs as {path, result}}
			<AggResultView
				meta={path[0]}
				{result}
				title={getTitle(path)}
			/>
		{/each}
	</div>
</section>

<style>
	.FieldsAggsDisplay {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: min-content ;
		grid-template-areas:
			'single_values'
			'compound_values'
			'charts';
		grid-gap: 1em;
	}

	.header {
		grid-area: header;
	}

	.single_values {
		grid-area: single_values;
	}

	.compound_values {
		grid-area: compound_values;
	}

	.charts {
		grid-area: charts;
	}

	.aggs {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(26em, 1fr));
		overflow: hidden;
	}
</style>
