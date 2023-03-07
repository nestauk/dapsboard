<script>
	import {ChevronDown, ChevronRight, Icon} from '@svizzle/ui';

	let isCollapsed = false;

	const toggle = () => {
		isCollapsed = !isCollapsed;
	};

	$: glyph = isCollapsed ? ChevronRight : ChevronDown;
</script>

<section class='Collapsible'>
	<header>
		<button
			on:click={toggle}
		>
			<Icon
				{glyph}
				stroke='black'
			/>
		</button>
		<slot name='header' />
	</header>
	<div class:collapsed={isCollapsed}>
		<slot name='content' />
	</div>
</section>

<style>
	.Collapsible {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: min-content 1fr;
	}
	header {
		background-color: white;
		display: grid;
		grid-template-columns: min-content 1fr;
		grid-template-rows: 1fr;
		grid-gap: 1em;
		align-items: center;
		position: sticky;
		top: 0;
		z-index: 1;
	}
	button {
		background-color: white;
		border: none;
		cursor: pointer;
	}
	div {
		padding-left: 24px;
	}
	.collapsed {
		display: none;
	}
</style>
