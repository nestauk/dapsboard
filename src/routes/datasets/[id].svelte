<script context='module'>
	export function preload({ params: {id}, query }) {
		return {
			id,
			spec: routes[id]
		}
	}
</script>

<script>
	import * as _ from 'lamb';

	import routes from 'app/data/routes.json';

	export let id;
	export let spec;
</script>

<svelte:head>
	<title>dapsboard - {id}</title>
</svelte:head>

<pre>{JSON.stringify(spec, null, 2)}</pre>

<style>
	pre {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		font-family: courier;
	}
</style>
