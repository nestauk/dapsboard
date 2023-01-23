<script>
	import IconSliders from '$lib/app/components/icons/IconSliders.svelte';
	export let position = 'top-right';
	export let popup = 'bottom';
	export let className = '';

	let icon;
	let menu;
	let menuOpen = false;

	function openMenu () {
		const rect = icon.getBoundingClientRect();
		if (rect.left + 80 > window.innerWidth) {
			menu.style.right = `${window.innerWidth - rect.right}px`;
		}
		if (rect.top + 80 > window.innerHeight) {
			menu.style.bottom = `0`;
		}
		if (popup === 'top') {
			menu.style.bottom = `${window.innerHeight - rect.top}px`;
		}
		menuOpen = true;
	}
	function closeMenu () {
		menuOpen = false;
	}
</script>

<div
	bind:this={icon}
	class={`icon ${position} ${className}`}
	on:mouseenter={openMenu}
	on:mouseleave={closeMenu}
>
	<IconSliders size={14} />
	<menu
		bind:this={menu}
		class:menuOpen
	>
		<header>
			<span>Settings</span>
		</header>
		<ul>
			<slot />
		</ul>
	</menu>
</div>

<style>
	.icon {
		background: white;
	}
	.icon.top-right {
		position: absolute;
		top: 1.7em;
		right: 1em;
	}
	.icon.bottom-right {
		position: absolute;
		bottom: 1.4em;
		right: 1em;
	}

	menu {
		display: none;
		position: fixed;
		background: white;
		border: 1px solid var(--color-grey-70);
		box-shadow: .2em .2em .4em #8888;
		padding: 0.5rem 0.75rem;
		z-index: 1;
	}
	menu.menuOpen {
		display: block;
	}

	menu > header {
		padding-bottom: 0.5em;
	}
	menu > ul {
		list-style: none;
	}
</style>
