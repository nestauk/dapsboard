<script>
	import {createEventDispatcher} from 'svelte';
	import {autoID} from '$lib/utils/generic.js';

	const dispatch = createEventDispatcher();

	let id = autoID();
	let value;
	let textInput;
	let searchButton;

	export let fieldName = '';

	function handleKeyDown (event) {
		switch (event.keyCode) {
			case 40:
				dispatch('downArrow');
				event.preventDefault();
				break;
			case 38:
				dispatch('upArrow');
				event.preventDefault();
				break;
			default:
		}
	}

	function emitFocusEvent () {
		dispatch('focus');
	}

	function emitBlurEvent () {
		dispatch('blur');
	}

	function emitSearchEvent () {
		dispatch('search', value);
		searchButton.focus();
	}

	function emitEditEvent (newValue) {
		dispatch('edit', newValue);
	}

	$: emitEditEvent(value);
</script>

<div>
	<span>
		<input
			{id}
			autocomplete='off'
			bind:this={textInput}
			bind:value
			on:blur={emitBlurEvent}
			on:change={emitSearchEvent}
			on:focus={emitFocusEvent}
			on:keydown={handleKeyDown}
			type='text'
		>
		<label for={id}>{fieldName}</label>
	</span>
	<button
		bind:this={searchButton}
		class='clickable'
		on:click={emitSearchEvent}
	>Search</button>
</div>

<style>
	div {
		display: grid;
		grid-template-columns: 1fr min-content;
	}
	span {
		display: grid;
		grid-template-columns: 1fr min-content
	}
	span, button {
		background: var(--color-menu-light);
		border-radius: 3px;
		border: 1px solid var(--color-menu-dark);
		font-weight: bold !important;
		margin: .25em;
		padding: .5em;
	}
	button {
		font-size: medium;
	}
	input {
		border-width: 0;
	}
	input:focus {
		outline: none;
	}
	label {
		color: var(--color-menu-dark);
		font-style: italic;
	}

	button {
		color: var(--color-menu-dark);
		font-weight: bold;
		padding: .5em 1em;
	}
</style>
