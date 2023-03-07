<script>
	import {isNotNil} from '@svizzle/utils';

	import {getComponentConfig} from '$lib/app/utils/resultsMapper.js';

	export let meta;
	export let result;
	export let title;

	let component;
	let keyProps;
	let resultProps;

	$: meta && result && (
		{
			component,
			keyProps,
			resultProps,
		} = getComponentConfig(meta, result)
	);
	$: props = {
		// ...keyProps,
		...resultProps
	};
</script>

<div class='AggResultView'>
	{#if isNotNil(title)}
		<div class='label'>{title}</div>
	{/if}
	<div>
		{#if component}
			<svelte:component this={component} {...props} />
		{/if}
	</div>
</div>

<style>
	.AggResultView {
		margin: 0.5em;
		max-height: 100%;
	}
	.label {
		font-weight: bold;
	}
</style>
