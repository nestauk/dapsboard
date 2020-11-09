<script>
	/* eslint-disable prefer-destructuring */

	import { createEventDispatcher } from 'svelte';
	import SimpleField from './SimpleField.svelte';

	const dispatch = createEventDispatcher();

	export let id = null;
	export let dataType = null;
	export let required = false;
	export let value = null;
	export let defaultValue;

	let type;
	let lat;
	let lon;
	let defaultLat;
	let defaultLon;
	let notEmpty = false;
	let complete = false;

	function handleValueChange (newValue) {
		if (newValue) {
			lat = newValue.lat;
			lon = newValue.lon;
			notEmpty = Boolean(lat || lon);
			complete = Boolean(lat && lon);
		} else {
			lat = null;
			lon = null;
			notEmpty = false;
			complete = false;
		}
	}
	function handleEditorChange (newValue) {
		let payload = null;
		if (complete) {
			payload = newValue;
		}
		dispatch('change', payload);
	}
	function handleChangeLat (event) {
		const newValue = {lat: event.detail, lon};
		handleValueChange(newValue);
		handleEditorChange(newValue);
	}
	function handleChangeLon (event) {
		const newValue = {lat, lon: event.detail};
		handleValueChange(newValue);
		handleEditorChange(newValue);
	}

	function handleFocus () {
		dispatch('focus');
	}
	function handleBlur () {
		dispatch('blur');
	}

	const types = {
		'integer': 'number',
		'float': 'number',
		'string': 'text',
	};

	$: type = types[dataType];
	$: handleValueChange(value);
	$: if (defaultValue) {
		defaultLat = defaultValue.lat;
		defaultLon = defaultValue.lon;
	} else {
		defaultLat = undefined;
		defaultLon = undefined;
	}
</script>

<div>
	<label for={`${id}-lat`} class='lat'>Lat</label>
	<div class='lat'>
		<SimpleField
			id={`${id}-lat`}
			{type}
			{dataType}
			value={lat}
			defaultValue={defaultLat}
			on:change={handleChangeLat}
			on:focus={handleFocus}
			on:blur={handleBlur}
			required={required || notEmpty}
		/>
	</div>
	<label for={`${id}-lon`} class='lon'>Lon</label>
	<div class='lon'>
		<SimpleField
			id={`${id}-lon`}
			{type}
			{dataType}
			value={lon}
			defaultValue={defaultLon}
			on:change={handleChangeLon}
			on:focus={handleFocus}
			on:blur={handleBlur}
			required={required || notEmpty}
		/>
	</div>
</div>

<style>
	div {
		display: grid;
		grid-template-areas: 'label1 label2' 'field1 field2';
		column-gap: 0.5em;
	}
	div.lat {
		grid-area: field1;
	}
	div.lon {
		grid-area: field2;
	}
	label.lat {
		grid-area: label1;
	}
	label.lon {
		grid-area: label2;
	}
</style>
