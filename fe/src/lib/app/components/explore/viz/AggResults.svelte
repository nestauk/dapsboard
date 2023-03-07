<script>
	import * as _ from 'lamb';

	import {getResultsByFieldSets} from '$lib/app/utils/resultsMapper.js';
	import Collapsible from '$lib/app/components/elementary/Collapsible.svelte';

	import FieldAggsDisplay from './displays/FieldAggsDisplay.svelte';
	import LevelDisplay from './displays/LevelDisplay.svelte';

	export let results;

	let resultsByFieldSets;

	const getComponentForDepth = depth => depth === 0
		? FieldAggsDisplay
		: LevelDisplay;

	$: if (results) {
		resultsByFieldSets = getResultsByFieldSets(results);
	}
</script>

{#if results}
	{#each resultsByFieldSets as [key, aggs]}
		{@const depth = key.split(',').length - 1}
		<Collapsible>
			<h1 slot='header'>Fields {key}</h1>
			<svelte:component
				{aggs}
				level={depth}
				slot='content'
				this={getComponentForDepth(depth)}
				title={key}
			/>
		</Collapsible>
	{/each}
{/if}

<style>
	h1 {
		font-weight: bold;
		margin: 0.8em 0;
		border-bottom: thin solid silver;
	}
</style>
