<script>
	import {getComponent} from '../utils/resultsMapper'

	export let aggKey;
	export let aggResult;

	let component;
	let keyProps;
	let origin;
	let resultProps;

	$: aggKey && aggResult && (
		{
			component,
			keyProps,
			origin,
			resultProps,
		} = getComponent(aggKey, aggResult)
	);
	$: props = {
		...keyProps,
		...resultProps
	};
</script>

<div class='View'>
	{#if !keyProps}
		<div class='label'>{origin.aggId}</div>
	{/if}
	<div>
		{#if component}
			<svelte:component this={component} {...props} />
		{/if}
	</div>
</div>

<style>
	.View {
		margin: 0.5em;
		max-height: 100%;
	}
	.label {
		font-weight: bold;
	}
</style>
