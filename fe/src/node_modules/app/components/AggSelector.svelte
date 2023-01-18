<script>
	import Select from 'app/components/elementary/Select.svelte';
	import ExternalLink from 'app/components/ExternalLink.svelte';
	import aggsDocURL from 'elasticsearch/config/aggsDocURL';

	export let title = '';
	export let selectedOption = null;
	export let hideDisabled = false;
	export let options = [];
	export let setAggDocs = null;

	export let selectionChangedHandler;
</script>

<header class='semibold'>{title}</header>
<Select
	{selectedOption}
	{hideDisabled}
	{options}
	on:selectionChanged={selectionChangedHandler}
	let:option={option}
>
	<div
		class='select-item'
		on:mouseover={() => setAggDocs?.(option.value)}
		on:mouseout={() => setAggDocs?.(null)}
	>
		<div>{option.text}</div>
		<ExternalLink href={aggsDocURL[option.value]} size={14} />
	</div>
</Select>

<style>
	header {
		font-size: 1em;
		margin: .5em 0;
	}
	.select-item {
		display: grid;
		grid-template-columns: 1fr min-content;
		grid-column-gap: 1em;
	}
</style>
