<script>
	import {page as _page} from '$app/stores';

	import Nav from '$lib/app/components/Nav.svelte';

	$: [,segment] = $_page.url.pathname.split('/');
</script>

<header>
	<Nav {segment}/>
</header>

<main>
	<slot></slot>
</main>

<style>
	header {
		height: var(--dim-header-height);
		width: 100%;
		padding: 0 var(--dim-padding);
		border-bottom: 1px solid var(--color-main-lighter);
		background-color: var(--color-main);
		color: white;
	}

	main {
		height: var(--dim-main-height);
		width: 100%;
	}
</style>
