<script context='module'>
	import routes from 'app/data/routes.json';

	export function preload({ params: {id} }) {
		return {
			id,
			spec: routes[id]
		}
	}
</script>

<script>
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
