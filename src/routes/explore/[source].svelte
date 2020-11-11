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

<script>
	import * as _ from 'lamb';

	// eslint-disable-next-line node/no-extraneous-import
	import {hrefBoard} from 'app/utils/exploreUtils';
	import {createExploreMachine} from 'app/machines/explore/route';
	import {
		resetSources,
		selectedDatasetFields,
		selectSource,
	} from 'app/stores/exploreStores';

	const makeDepthByField = _.pipe([
		_.mapWith((x, i) => [x, i + 1]),
		_.fromPairs,
	]);
	const makeLockedDepthByField = _.pipe([_.init, makeDepthByField]);

	const fontSize = 16;
	const depthFontSize = 0.8 * fontSize;
	const lineHeight = 3 * fontSize;
	const halfLineHeight = lineHeight / 2;
	const radius = halfLineHeight / 2;
	const padding = halfLineHeight / 2;

	const {machine, contextStores: {
		selectedFields
	}} = createExploreMachine();

	export let fields;
	export let project;
	export let source;
	export let version;

	let width = 0;

	$: if (source) {
		selectSource(source);
	} else {
		resetSources();
	}

	$: fields = fields.length > 0 ? fields : [$selectedDatasetFields[0]];
	$: machine.send('SELECTED_FIELDS', {fields});
	$: selectionHeader = $selectedFields && $selectedFields.join(' by ') || '';
	$: depthByField = makeDepthByField($selectedFields);
	$: lockedDepthByField = makeLockedDepthByField($selectedFields);
	$: sidebar = $selectedDatasetFields
		&& $selectedDatasetFields.map((field, index) => ({
			depth: depthByField[field],
			field,
			locked: lockedDepthByField[field],
			selected: $selectedFields.includes(field),
			y: index * lineHeight,
		}));
	$: height = $selectedDatasetFields
		&& $selectedDatasetFields.length * lineHeight || 0;
	$: depthCx = width - padding - radius;
	$: nameX = depthCx - radius - padding;
</script>

<svelte:head>
	<title>Explore - {source}:{project}@{version}, {selectionHeader}</title>
</svelte:head>

<section class='layout'>
	<section class='navheader'>
		<p>
			<span>{source}</span>
			<span>{project}</span>
			<span>{version}</span>
		</p>
	</section>
	<section
		bind:clientWidth={width}
		class='selection'
	>
		<svg {height}>
			{#if sidebar}
				{#each sidebar as {depth, field, selected, y}}
					<g
						transform='translate(0,{y})'
						class:locked={false}
					>
						<rect
							height={lineHeight}
							{width}
						/>
						<a href={hrefBoard({project, source, version, fields: field})}>
							<text
								class:selected
								class='fieldname'
								font-size={fontSize}
								x={nameX}
								y={halfLineHeight}
							>{field}</text>
						</a>
						<circle
							r={radius}
							cx={depthCx}
							cy={halfLineHeight}
						/>
						{#if depth}
							<text
								class:selected
								class='depth'
								font-size={depthFontSize}
								x={depthCx}
								y={halfLineHeight}
							>{depth}</text>
						{/if}
					</g>
				{/each}
			{/if}
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
		fill: none;
	}
	.selection text {
		stroke: none;
		dominant-baseline: central;
	}
	.selection text.fieldname {
		text-anchor: end;
	}
	.selection text.depth {
		text-anchor: middle;
	}
	.selection text.selected {
		fill: orange;
		font-family: 'Open Sans SemiBold';
		font-weight: bold;
	}

	.selection circle {
		fill-opacity: 0;
		stroke: black;
	}
	.selection circle.selected {
		stroke: orange;
	}
	.selection.locked text {
		fill: white;
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
