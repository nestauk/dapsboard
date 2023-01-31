<script>
	import { createEventDispatcher } from 'svelte';

	import PanelMenu from '$lib/app/components/elementary/PanelMenu.svelte';
	import MenuItem from '$lib/app/components/elementary/MenuItem.svelte';
	import { autoID } from '$lib/utils/ids.js';

	const dispatch = createEventDispatcher();

	let hideDisabledID = autoID();
	export let hideDisabled = false;

	$: dispatch('hideDisabledChanged', hideDisabled);
</script>

<PanelMenu>
	<MenuItem>
		<input
			bind:checked={hideDisabled}
			id={hideDisabledID}
			type='checkbox'
		/>
		<label
			for={hideDisabledID}
			class='clickable'
		>Hide disabled items</label>
	</MenuItem>
</PanelMenu>
