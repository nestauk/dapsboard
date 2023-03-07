<script>
	import * as _ from "lamb";

	import ValueDisplay from "./ValueDisplay.svelte";

	export let label;
	export let stats;

	$: pairs = _.pairs(stats);
</script>

<div>
	<div class='label'>{label}</div>
	{#each pairs as [key, value]}
		{#if !isNaN(value)}
			<ValueDisplay label={key} value={value} />
		{/if}
	{/each}
</div>

<style>
	.label {
		font-weight: bold;
	}
</style>
