<script>
	import {Icon, ExternalLink} from '@svizzle/ui';

	export let href;
	export let text;
	export let size;

	$: size = size || 14;
	$: text = text || '';
</script>

<!-- svelte-ignore security-anchor-rel-noreferrer -->
<a {href} target='_blank' on:click={e => e.stopPropagation()}>
	<span>{text}</span>
	<span>
		<Icon 
			glyph={ExternalLink}
			{size}
			stroke='rgb(16, 174, 249)'
		/>
		<!-- stroke: --color-link-ext -->
	</span>
</a>

<style>
	a {
		text-decoration: none;
	}

	a span:nth-child(2) {
		margin-left: 0.1rem;
	}
</style>
