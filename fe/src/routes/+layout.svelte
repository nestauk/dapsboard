<script>
	import {
		_screen,
		ScreenSensor,
		StorageIO
	} from '@svizzle/ui';
	
	import {page as _page} from '$app/stores';

	import Nav from '$lib/app/components/Nav.svelte';
	import AuthPrompt from '$lib/app/components/AuthPrompt.svelte';

	import {
		_credentials,
		_isAuthModalOpen
	} from '$lib/app/stores/auth.js';

	const onCloseAuth = () => {
		$_isAuthModalOpen = false;
	};

	$: [,segment] = $_page.url.pathname.split('/');
</script>

<ScreenSensor />
<StorageIO
	_store={_credentials}
	defaultValue={{}}
	isReactive={true}
	key='credentials'
	type='localStorage'
/>

<header>
	<Nav {segment} />
</header>

<main>
	<slot></slot>
</main>

{#if $_isAuthModalOpen}
	<AuthPrompt on:close={onCloseAuth}/>
{/if}

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
