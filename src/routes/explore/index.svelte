<script context='module'>
	export function preload ({ query: {project, source, version} }) {
		return {project, source, version}
	}
</script>

<script>
	import IconChevronDown from 'app/components/icons/IconChevronDown.svelte';
	import IconChevronUp from 'app/components/icons/IconChevronUp.svelte';
	import IconChevronRight from 'app/components/icons/IconChevronRight.svelte';

	import {
		navigator,
		resetSources,
		selectDataset,
		selectSource,
		toggleSource,
	} from 'app/stores/exploreStores';

	const hrefMenu = (source, {project, version}) =>
		`explore?source=${source}&project=${project}&version=${version}`;

	export let source;
	export let project;
	export let version;

	$: hrefBoard = project && source && version
		&& `explore/${source}?project=${project}&version=${version}`;

	$: if (source) {
		selectSource(source);
	} else {
		resetSources();
	}
</script>

<svelte:head>
	<title>Explore - {source}: {project}@{version}</title>
</svelte:head>

<section class='layout'>
	<nav>
		<ul>
			{#each $navigator as {
				activeDataset,
				activeDatasetIndex,
				datasets,
				isExpanded,
				isSelected,
				sourceName,
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
								href={hrefMenu(sourceName, activeDataset)}
								rel='prefetch'
							>
								<div class='ids'>
									<p>{sourceName}</p>
									<p>{activeDataset.project} v.{activeDataset.version}</p>
							</a>
						</div>
						{#if isSelected}
							<div
								class='toggle'
								on:click={toggleSource(source)}
							>
								{#if isExpanded}
									<IconChevronUp />
								{:else}
									<IconChevronDown />
								{/if}
							</div>
						{/if}
					</div>

					<!-- versions -->

					{#if isExpanded}
						<ul>
							{#each datasets as dataset, index}
								<li
									class='dataset'
									class:active={index === activeDatasetIndex}
								>
									<a
										class='undecor'
										href={hrefMenu(source, dataset)}
										on:click={selectDataset(source, index)}
										rel='prefetch'
									>
										<p>{dataset.project} (v. {dataset.version})</p>
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
					<IconChevronRight />
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
