<script>
	import {createEventDispatcher} from 'svelte';

	const dispatch = createEventDispatcher();

	export let fieldStats = [];
	export let selectedFieldName;

	function selectField (fieldName) {
		selectedFieldName = fieldName;
		dispatch('fieldSelected', fieldName);
	}
</script>

{#each fieldStats as field}
	<div
		class:bold={field.name === selectedFieldName}
		class:selected={field.name === selectedFieldName}
		class='field clickable'
		on:mousedown={() => selectField(field.name)}
	>
		<span>{field.name}</span>
		<span>{field.count}</span>
	</div>
{/each}

<style>
	.field {
		background: var(--color-menu-light);
		border-bottom: thin solid var(--color-menu-dark);
		color: var(--color-menu-dark);
		font-size: medium;
		padding: .5em;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.field:last-child {
		border-bottom: none;
	}

	.field.selected {
		background: var(--color-menu-dark);
		color: var(--color-menu-light);
	}
</style>
