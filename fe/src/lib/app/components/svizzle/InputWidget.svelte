<script>
	import {makeStyleVars} from '@svizzle/dom';
	import {createEventDispatcher} from 'svelte';

	import Input from './Input.svelte';

	export let buttonText = 'Submit';
	export let hasButton = true;
	export let placeholder = 'Please insert a value';
	export let type = 'text';
	export let value = '';
	export let validateValue = () => true;

	export let theme = {
		borderColor: 'rgb(70, 70, 70)',
		invalidValueColor: 'red',
		maxWidth: '32em'
	};

	const dispatch = createEventDispatcher();

	const onSubmit = () => isValid && dispatch('valueSubmitted', value);

	$: isValid = validateValue(value);
	$: inputTheme = {
		borderColor: isValid
			? theme.borderColor
			: theme.invalidValueColor
	};
	$: style = makeStyleVars(theme);
</script>

<div class='ValueWidget' {style}>
	<div class='controls'>
		<Input
			autofocus=true
			bind:value
			on:submitted={onSubmit}
			placeholder={placeholder}
			theme={inputTheme}
			type={type}
		/>
		{#if hasButton}
			<button
				disabled={!isValid}
				on:click={onSubmit}
			>
				{buttonText}
			</button>
		{/if}
	</div>
</div>

<style>
	.ValueWidget {
		align-items: center;
		display: grid;
		grid-template-columns: 1fr;
		height: 100%;
		justify-items: center;
		padding: 1em;
		width: 100%;
	}
	.controls {
		column-gap: 0.5em;
		display: grid;
		grid-template-columns: 1fr min-content;
		max-width: var(--maxWidth);
		width: 100%;
	}
	button {
		border-radius: 0.125em;
		font-size: 1em;
		padding: 0.5em;
	}
</style>
