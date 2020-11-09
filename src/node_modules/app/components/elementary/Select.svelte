<script>
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();

export let options;
export let selectedOption;
export let unselectable = true;
export let hideDisabled = false;
export let disabled = false;

function handleClick (v, isDisabled) {
	if (disabled) {
		return;
	}
	const oldSelection = selectedOption;
	if (unselectable && selectedOption === v) {
		selectedOption = undefined;
		oldSelection !== selectedOption && dispatch('selectionChanged', selectedOption);
		return;
	}

	if (!isDisabled) {
		selectedOption = v;
		oldSelection !== selectedOption && dispatch('selectionChanged', selectedOption);
	}
}
</script>

<ul class:disabled>
	{#each options as opt}
		{#if !(opt.disabled && hideDisabled) || opt.value === selectedOption}
			<li
				class:disabled={opt.disabled}
				class:effaced={opt.effaced}
				class:selected={opt.value === selectedOption}
				on:click={() => handleClick(opt.value, opt.disabled)}
				class='clickable'
			>
				<slot option={opt}>
					{opt.text}
				</slot>
			</li>
		{/if}
	{/each}
</ul>

<style>
	ul {
		grid-area: select;
		overflow: auto;
		list-style-type: none;
	}

	ul.disabled {
		color: silver;
	}

	li.disabled {
		color: #fC8;
		font-weight: normal;
	}

	li.selected {
		background: #248;
		color: white
	}

	ul.disabled li.selected {
		background: #8CF;
	}

	li.selected.disabled,
	li.selected.effaced {
		background: #842;
	}

	li.effaced {
		color: #8cf;
	}
</style>
