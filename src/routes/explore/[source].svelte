<script context='module'>
	export function preload ({
		params: {source},
		query: {project, version, fields}
	}) {
		return {
			fields: fields && fields.split(',') || [],
			project,
			source,
			version,
		}
	}
</script>

<svelte:head>
	<title>Board - {source}:{project}@{version}</title>
</svelte:head>

<script>
	import {hrefBoard} from 'app/utils/exploreUtils';
	import {createExploreMachine} from 'app/machines/explore/route';
	import {
		resetSources,
		selectedDatasetFields,
		selectSource,
	} from 'app/stores/exploreStores';

	const fontSize = 18;
	const lineHeight = 3 * fontSize;

	export let project;
	export let source;
	export let version;
	export let fields;

	const {machine, contextStores: {
		selectedFields
	}} = createExploreMachine();

	$: if (source) {
		selectSource(source);
	} else {
		resetSources();
	}

	$: fields = fields.length > 0 ? fields : [$selectedDatasetFields[0]];
	$: machine.send('SELECTED_FIELDS', {fields});
	$: selectionHeader = $selectedFields && $selectedFields.join(' by ') || '';
	$: sidebar = $selectedDatasetFields && $selectedDatasetFields.map((field, index) => ({
		field,
		y: (index + 0.5) * lineHeight,
		x:  0.5 * lineHeight
	}));
	$: height = $selectedDatasetFields.length * lineHeight;
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
		<svg {height}>
			<g>
				{#each sidebar as {field, x, y}, index}
					<a href={hrefBoard({project, source, version, fields: field})}>
						<g class:selected={$selectedFields.includes(field)}>
							<rect
								height={lineHeight}
								y={index * lineHeight}
							/>
							<text {x} {y}>{field}</text>
						</g>
					</a>
				{/each}
			</g>
		</svg>
	</section>
	<section class='contentheader'>
		<p>{selectionHeader}</p>
	</section>
	<section class='results'>
		TODO: Results
	</section>
</section>

<style>
	.layout {
		--dim-headerHeight: 3rem;
		display: grid;
		grid-template-columns: var(--dim-sidebarWidth) calc(100% - var(--dim-sidebarWidth));
		grid-template-rows: var(--dim-headerHeight) calc(100% - var(--dim-headerHeight));
		grid-template-areas:
			"sidebar1 content1"
			"sidebar2 content2";
		height: 100%;
		width: 100%;
	}

	.navheader {
		align-items: center;
		border-bottom: 1px solid lightgrey;
		border-right: 1px solid var(--color-main-lighter);
		display: flex;
		font-weight: var(--dim-fontsize-light);
		grid-area: sidebar1;
		justify-content: space-between;
		padding: 1rem;
		width: 100%;
	}

	svg {
		width: 100%;
	}
	.selection {
		border-right: 1px solid var(--color-main-lighter);
		grid-area: sidebar2;
		overflow-y: auto;
	}

	.selection rect {
		fill: white;
		width: 100%;
	}
	.selection text {
		dominant-baseline: middle;
		stroke: none;
	}

	.selection .selected rect {
		fill: var(--color-grey-70);
	}
	.selection .selected text {
		fill: white;
		font-family: 'Open Sans SemiBold';
		font-weight: bold;
	}

	.contentheader {
		align-items: center;
		border-bottom: 1px solid lightgrey;
		display: flex;
		font-weight: var(--dim-fontsize-light);
		grid-area: content1;
		justify-content: space-between;
		padding: 1rem;
		width: 100%;
	}
	.results {
		grid-area: content2;
		padding: 1rem;
	}
</style>
