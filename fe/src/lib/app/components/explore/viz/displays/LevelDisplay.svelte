<script>
	import Collapsible from '$lib/app/components/elementary/Collapsible.svelte';

	import AggResultView from './AggResultView.svelte';

	export let aggs;
	export let title;

	const getSummary = meta => `${meta.fieldName} : ${meta.aggId}`
	
	$: aggs = aggs || [];
	$: title = title || '';
</script>

<section class='LevelDisplay'>
	{#each aggs as aggsForKey}
		{@const path = aggsForKey.path}
		<Collapsible>
			<h3 slot='header'>
				<strong>{getSummary(path[1])}</strong>
				<em>by</em>
				<strong>{getSummary(path[0])}</strong>
			</h3>
			<div slot='content'>
				{#each aggsForKey.result as agg}
					<AggResultView
						result={agg.result}
						meta={aggsForKey.path[1]}
						title={agg.key}
					/>
				{/each}
			</div>
		</Collapsible>
	{/each}
</section>

<style>
	div {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(26em, 1fr));
		overflow: hidden;
	}
</style>
