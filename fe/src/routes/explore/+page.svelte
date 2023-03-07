<script>
	import {page as _page} from '$app/stores';
	import {browser} from '$app/environment';

	import {
		Icon,
		ChevronDown,
		ChevronRight,
		ChevronUp
	} from '@svizzle/ui';

	import {
		navigator,
		resetSources,
		selectDataset,
		selectSource,
		toggleSource,
		selectedDataset,
		selectedDatasetFields
	} from '$lib/app/stores/exploreStores.js';
	import {makeStandardKeyAdapter} from '$lib/app/utils/events.js';
	import {makeExploreQuery} from '$lib/app/utils/exploreUtils.js';
	import {collectionToObject} from '$lib/utils/svizzle/utils/collection-object.js';
	import {getFieldSetsPromise} from '$lib/elasticsearch/utils/coverage.js';

	const makeHrefBoard = ({fields, source, project, version}) =>
		`/explore/${source}?${makeExploreQuery({fields, project, version})}`;

	const hrefMenu = ({project, source, version}) =>
		`/explore?source=${source}&${makeExploreQuery({project, version})}`;

	let searchParams;
	let source;
	let project;
	let version;
	let fieldSets;
	let fieldSetsLoadingError = false;

	const onKbdToggleSource = makeStandardKeyAdapter(toggleSource);

	const waitFieldsets = async (dataset, fields) => {
		try {
			fieldSets = null;
			fieldSetsLoadingError = false;
			fieldSets = await getFieldSetsPromise(dataset, fields);
			console.log('fieldSets', fieldSets);
		} catch (error) {
			fieldSetsLoadingError = true;
		}
	};

	$: browser && ({url: {searchParams}} = $_page);
	$: searchParams && ({source, project, version} = collectionToObject(searchParams));

	$: hrefBoard = project && source && version
		&& makeHrefBoard({project, source, version});

	$: if (source) {
		selectSource(source);
	} else {
		resetSources();
	}

	$: project && source && version && selectDataset({project, source, version});
	$: if ($selectedDataset && $selectedDatasetFields) {
		waitFieldsets($selectedDataset, $selectedDatasetFields);
	}
</script>

<svelte:head>
	<title>Explore - {source}: {project}@{version}</title>
</svelte:head>

<section class='layout'>
	<nav>
		<ul>
			{#each $navigator as {
				activeDataset: {project, version},
				activeDatasetId,
				datasets,
				isExpanded,
				isSelected,
				source,
			}}
				<li>
					<!-- source -->

					<div
						class='source'
						class:selected={isSelected}
					>
						<div class='target'>
							<a
								class='undecor'
								href={hrefMenu({project, source, version})}
								rel='prefetch'
							>
								<div class='ids'>
									<p>{source}</p>
									<p>{project} v.{version}</p>
							</a>
						</div>
						{#if isSelected}
							<div
								class='toggle'
								on:click={toggleSource(source)}
								on:keydown={onKbdToggleSource(source)}
							>
								{#if isExpanded}
									<Icon glyph={ChevronUp} />
								{:else}
									<Icon glyph={ChevronDown} />
								{/if}
							</div>
						{/if}
					</div>

					<!-- versions -->

					{#if isExpanded}
						<ul>
							{#each datasets as {id, project, version}}
								<li
									class='dataset'
									class:active={id === activeDatasetId}
								>
									<a
										class='undecor'
										href={hrefMenu({project, source, version})}
										on:click={selectDataset({project, source, version})}
										rel='prefetch'
									>
										<p>{project} (v. {version})</p>
									</a>
								</li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
		</ul>
	</nav>
	<main>
		{#if hrefBoard}
			<a
				href={hrefBoard}
				class='undecor'
				rel='prefetch'
			>
				<div class='button'>
					<p>Explore</p>
					<Icon glyph={ChevronRight} />
				</div>
			</a>
		{:else}
			<p class='message'>Please Select a dataset</p>
		{/if}
	</main>
</section>

<style>
	.layout {
		height: 100%;
		width: 100%;

		display: grid;
		grid-template-columns: var(--dim-sidebarWidth) calc(100% - var(--dim-sidebarWidth));
		grid-template-rows: 100%;
	}

	/* sidebar */

	nav {
		height: 100%;
		width: 100%;
		overflow-y: auto;

		border-right: 1px solid var(--color-main-lighter);
		font-weight: var(--dim-fontsize-light);
	}

	.source {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.source:hover {
		background-color: var(--color-blue-lighter);
		color: black;
	}
	.source .target {
		flex: 1;
	}

	.ids {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	p {
		line-height: 1.5rem;
		padding: var(--dim-padding);
	}
	.ids p:first-child {
		font-weight: bold;
		font-family: Open Sans Bold;
		margin-right: 1rem;
		cursor: pointer;
	}

	.selected {
		background-color: var(--color-blue-darker);
		color: white;
	}

	.toggle {
		cursor: pointer;
		user-select: none;
	}

	.dataset p {
		margin-left: 1rem
	}
	.dataset {
		background-color: var(--color-blue-pale);
	}
	.dataset:hover {
		background-color: var(--color-blue-lighter);
	}

	/* content */

	main {
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.message {
		background-color: var(--color-blue-darker);
		border-radius: 10rem;
		padding: 0.6rem 1.5rem;
		color: white;
		font-weight: bold;
		font-size: 1.1rem;
		font-family: 'Open Sans Regular';
	}

	.button {
		border-radius: 0.5rem;
		background-color: var(--color-blue-darker);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem;
	}
	.button p {
		margin-right: 0.5rem;
	}
</style>
