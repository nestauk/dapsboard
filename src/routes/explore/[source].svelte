<script context='module'>
	export function preload ({
		params: {source},
		query: {project, version, fieldsString}
	}) {
		return {source, project, version, fieldsString}
	}
</script>

<svelte:head>
	<title>Board – {source}:{project}@{version}</title>
</svelte:head>

<script>
	export let fieldsString;
	export let project;
	export let source;
	export let version;

	$: fields = fieldsString && fieldsString.split(',') || [];
</script>

<section class='layout'>
	<section class='navheader'>
		<p>
			<span>{source}</span>
			<span>{project}</span>
			<span>{version}</span>
		</p>
	</section>
	<section class='selection'>
		TODO: selection
	</section>
	<section class='contentheader'>
		<p>Selected fields: {fields.join(' by ')}</p>
	</section>
	<section class='results'>
		TODO: Results
	</section>
</section>

<style>
	.layout {
		height: 100%;
		width: 100%;

		--dim-headerHeight: 2rem;
	}

	.layout {
		display: grid;
		grid-template-columns: var(--dim-sidebarWidth) calc(100% - var(--dim-sidebarWidth));
		grid-template-rows: var(--dim-headerHeight) calc(100% - var(--dim-headerHeight));
		grid-template-areas:
			"sidebar1 content1"
			"sidebar2 content2"
	}

	.navheader {
		align-items: center;
		border-bottom: 1px solid lightgrey;
		border-right: 1px solid var(--color-main-lighter);
		display: flex;
		font-weight: var(--dim-fontsize-light);
		justify-content: space-between;
		width: 100%;
		grid-area: sidebar1;
		background-color: orange;
	}
	.selection {
		grid-area: sidebar2;
		background-color: yellow;
	}

	.contentheader {
		align-items: center;
		border-bottom: 1px solid lightgrey;
		border-right: 1px solid var(--color-main-lighter);
		display: flex;
		font-weight: var(--dim-fontsize-light);
		justify-content: space-between;
		width: 100%;
		grid-area: content1;
		background-color: cyan;
	}
	.results {
		grid-area: content2;
		background-color: palegoldenrod;
	}
</style>
