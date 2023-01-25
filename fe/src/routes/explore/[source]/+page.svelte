<script>
    import {browser} from '$app/environment';
	import * as _ from 'lamb';
	import {onMount} from 'svelte';
	import JSONTree from 'svelte-json-tree';

	import {page as _page} from '$app/stores';

	import IconChevronLeft from '$lib/app/components/icons/IconChevronLeft.svelte';
	import IconChevronDown from '$lib/app/components/icons/IconChevronDown.svelte';
	import IconChevronUp from '$lib/app/components/icons/IconChevronUp.svelte';
	import FieldMenu from '$lib/app/components/explore/suggestions/FieldMenu.svelte';
	import Search from '$lib/app/components/explore/suggestions/Search.svelte';
	import {createExploreMachine} from '$lib/app/machines/explore/route';
	import {selectedDatasetFields} from '$lib/app/stores/exploreStores';
	import {makeDepthByField, makeExploreIndexPath} from '$lib/app/utils/exploreUtils';
	import {collectionToObject} from '$lib/utils/svizzle/collection-object.js';

	const fontSize = 16;
	const depthFontSize = 0.8 * fontSize;
	const lineHeight = 3 * fontSize;
	const halfLineHeight = lineHeight / 2;
	const radius = halfLineHeight / 2;
	const padding = halfLineHeight / 2;

	const {machine, contextStores: {
		fieldStats,
		isNextFieldDisabled,
		isPrevFieldDisabled,
		isFieldsMenuActive,
		selectedFieldName,
		selectedFields,
		currentResult,
		suggestions,
	}} = createExploreMachine();

	let searchParams;
	let source;
	let project;
	let version;
	let fields;

	let width = 0;

	$: browser && ({params: {source}, url: {searchParams}} = $_page);
	$: searchParams && ({project, version, fields} = collectionToObject(searchParams));

	$: if (source) {
		machine.send('SELECT_SOURCE', {source});
	} else {
		machine.send('RESET_SOURCES');
	}

	$: hrefBack = project && source && version
		&& makeExploreIndexPath({project, source, version});

	$: project && source && version
		&& machine.send('DATASET_UPDATED', {project, source, version});

	$: selectionHeader = $selectedFields?.join(' by ') || '';
	$: depthByField = makeDepthByField($selectedFields);
	$: lockedFields = _.init($selectedFields);
	$: sidebar = $selectedDatasetFields
		&& $selectedDatasetFields.map((field, index) => ({
			depth: depthByField[field],
			field,
			locked: lockedFields.includes(field),
			selected: $selectedFields.includes(field),
			y: index * lineHeight,
		}));
	$: height = $selectedDatasetFields
		&& $selectedDatasetFields.length * lineHeight || 0;
	$: depthCx = width - padding - radius;
	$: nameX = depthCx - radius - padding;

	onMount(() => {
		const pageReloader = () => {
			machine.send('SELECTED_FIELDS', {
				fields: fields?.length > 0
					? fields.split(',')
					: $selectedDatasetFields
						? [$selectedDatasetFields[0]]
						: []
			});
		};

		addEventListener('popstate', pageReloader);
		const unsubscribe = _page.subscribe(pageReloader);

		return () => {
			removeEventListener('popstate', pageReloader);
			unsubscribe?.();
			machine.send('RESET_SEARCH');
		};
	});

	const clickedField =
		field => machine.send('SELECTED_FIELDS', {fields: [field]});
	const clickedFieldCounter =
		field => machine.send('TOGGLED_FIELD_COUNTER', {field});
	const clickedNextField = () => machine.send('SELECTED_NEXT_FIELD');
	const clickedPrevField = () => machine.send('SELECTED_PREVIOUS_FIELD');

	const onDownArrow = () => machine.send('NEXT_FIELD_SELECTED');
	const onFieldSelected =
		({detail}) => machine.send({type:'FIELD_SELECTED', detail});
	const onSearchBlurred = () => machine.send('FIELD_STATS_HIDDEN');
	const onSearchEdited = ({detail}) => machine.send({type:'TYPED', detail});
	const onSearchFocused = () => machine.send('FIELD_STATS_SHOWN');
	const onSearchRequested =
		({detail}) => machine.send({type:'SEARCHED', detail});
	const onUpArrow = () => machine.send('PREV_FIELD_SELECTED');
</script>

<svelte:head>
	<title>Explore - {source}:{project}@{version}, {selectionHeader}</title>
</svelte:head>

<section class='layout'>
	<section class='contentsearch'>
		<Search
			fieldName={$selectedFieldName ?? ''}
			on:blur={onSearchBlurred}
			on:downArrow={onDownArrow}
			on:edit={onSearchEdited}
			on:focus={onSearchFocused}
			on:search={onSearchRequested}
			on:upArrow={onUpArrow}
		/>
		{#if $isFieldsMenuActive && $fieldStats.length > 0}
			<div
				class:withSuggestions={$suggestions.length > 0}
				class='searchhelpers'
			>
				{#if $suggestions.length > 0}
					<ul class='suggestions'>
						{#each $suggestions as suggestion}
							<li>{suggestion}</li>
						{/each}
					</ul>
				{/if}
				<div>
					<FieldMenu
						fieldStats={$fieldStats}
						on:fieldSelected={onFieldSelected}
						selectedFieldName={$selectedFieldName}
					/>
				</div>
			</div>
		{/if}
	</section>
	<section class='navheader'>
		<a class='undecor' href={hrefBack}>
			<IconChevronLeft />
		</a>
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
		<svg {height} {width}>
			{#if sidebar}
				{#each sidebar as {depth, field, locked, selected, y}}
					<g
						transform='translate(0,{y})'
						class:locked
						class:selected
					>
						<rect
							height={lineHeight}
							{width}
						/>
						<text
							class='fieldname unselectable'
							font-size={fontSize}
							on:click={clickedField(field)}
							x={nameX}
							y={halfLineHeight}
						>{field}</text>
						<circle
							r={radius}
							cx={depthCx}
							cy={halfLineHeight}
							on:click={clickedFieldCounter(field)}
						/>
						{#if depth}
							<text
								class='depth unselectable'
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
	<section class='controls'>
		<!-- TODO Button component -->
		<div
			class:clickable={!$isNextFieldDisabled}
			class:disabled={$isNextFieldDisabled}
			class='button fieldnav'
			on:click={!$isNextFieldDisabled && clickedNextField}
		>
			<IconChevronDown stroke='white' />
		</div>
		<div
			class:clickable={!$isPrevFieldDisabled}
			class:disabled={$isPrevFieldDisabled}
			class='button fieldnav'
			on:click={!$isPrevFieldDisabled && clickedPrevField}
		>
			<IconChevronUp stroke='white' />
		</div>
	</section>
	<section class='contentheader'>
		<p>{selectionHeader}</p>
	</section>
	<section class='results'>
		{#if $currentResult}
			<JSONTree value={$currentResult} />
		{/if}
	</section>
</section>

<style>
	.layout {
		--dim-headerHeight: 3rem;
		display: grid;
		grid-template-columns: var(--dim-sidebarWidth) 1fr;
		grid-template-rows: var(--dim-headerHeight) min-content 1fr var(--dim-headerHeight);
		grid-template-areas:
			"sidebar1 content1"
			"sidebar2 searchbar1"
			"sidebar2 content2"
			"sidebar3 content2";
		height: 100%;
		width: 100%;
	}

	/* searchbar */
	.contentsearch {
		grid-area: searchbar1;
		position: relative;
		width: 75%;
		margin: auto;
	}
	.searchhelpers {
		position: absolute;
		width: 100%;
		z-index: 1;
		display: grid;
		grid-template-columns: 1fr;
		border: thin solid var(--color-menu-dark);
	}
	.withSuggestions {
		grid-template-columns: 1fr 1fr;
	}
	.suggestions {
		background: var(--color-menu-dark);
		color: white;
		font-size: 1.1rem;
		list-style: none;
		padding: 0.8rem;
	}
	.suggestions > li {
		display: inline-block;
		padding: 0 .5em;
		white-space: nowrap;
	}
	/* sidebar: header */

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

	/* sidebar: selection */

	.selection {
		grid-area: sidebar2;
		overflow-y: auto;
		border-right: 1px solid var(--color-main-lighter);
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
		cursor: pointer;
	}
	.selection text.depth {
		text-anchor: middle;
		pointer-events: none;
	}
	.selection circle {
		cursor: pointer;
		fill: white;
		stroke: black;
	}
	.selection .selected text {
		fill: orange;
		font-family: 'Open Sans SemiBold';
		font-weight: bold;
	}
	.selection .selected circle {
		stroke: orange;
		stroke-width: 2;
	}
	.selection .locked rect {
		fill: orange;
	}
	.selection .locked text.fieldname {
		fill: white;
	}
	.selection .locked text.depth {
		fill: orange;
	}

	/* sidebar: controls */

	.controls {
		/* box-shadow: var(--box-shadow); */
		align-items: center;
		border-right: 1px solid var(--color-main-lighter);
		border-top: 1px solid var(--color-main-lighter);
		display: flex;
		grid-area: sidebar3;
		justify-content: center;
	}

	.button {
		align-items: center;
		border-radius: 5px;
		display: flex;
		height: 30px;
		justify-content: center;
		margin-right: 15px;
		width: 30px;
	}
	.button.fieldnav {
		background-color: rgb(232, 126, 250);
	}
	.button.fieldnav.disabled {
		background-color: rgb(245, 189, 255);
	}

	/* content */

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
		overflow-y: auto;
		padding: 1rem;
	}
</style>
