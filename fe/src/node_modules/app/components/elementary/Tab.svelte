<script>
	import { getContext } from 'svelte';

	import { tabsKey } from './TabContainer.svelte';

	export let id;
	export let isTitleSlot;
	export let isContentSlot;

	const {selectedTab, tabs} = getContext(tabsKey);

	// eslint-disable-next-line no-unused-vars
	$tabs = $tabs.some(t => t === id) ? $tabs : [...$tabs, id];
	$: isSelected = id === $selectedTab;

	const onClick = () => {
		// eslint-disable-next-line no-unused-vars
		$selectedTab = id
	}
</script>

{#if isTitleSlot}
	<button
		type="button"
		class="tab"
		class:selected={isSelected}
		on:click={onClick}
	>
		<slot name="title"/>
	</button>
{/if}

{#if isContentSlot && isSelected}
	<slot/>
{/if}

<style>
	.tab {
		border: none;
		border-bottom: thin solid black;
		cursor: pointer;
		background: none;
	}
	.tab:not(:last-child) {
		border-right: thin solid black;
	}
</style>
