<script>
	import sources from 'app/data/sidebar.json';
	import {capitalise} from 'svizzle/utils/string-string';
</script>

<section class="container">
	<nav>
		<ul>
			{#each sources as {source, releases}}
			<li>
				<!-- <a
					rel='prefetch'
					href='datasets/{source}'
				> -->
					<p>
						{source}
					</p>
				<!-- </a> -->
				<ul>
					{#each releases as {dataset, id}}
					<p>
						<a
							rel='prefetch'
							href='datasets/{id}'
						>
							<span>{id}</span>
						</a>
					</p>
					{/each}
				</ul>
			</li>
			{/each}
		</ul>
	</nav>
	<section class="content">
		<slot></slot>
	</section>
</section>

<style>
	.container {
		height: 100%;
		width: 100%;

		display: grid;
		grid-template-columns: 15% 85%;
		grid-template-rows: 100%;
	}
	.container > nav {
		grid-column: 1 / span 1;
		height: 100%;
		width: 100%;
		padding: var(--dim-padding);
		overflow-y: auto;

		background-color: var(--color-main);
		border-right: 1px solid var(--color-main-lighter);
		color: white;
		font-weight: var(--dim-fontsize-light);
	}
	.container > nav a {
		text-decoration: none;
	}
	.container > nav p {
		line-height: 1.5rem;
		display: flex;
		align-items: center;
		padding-left: 0.5rem;
    margin-bottom: 0.5rem;
	}

	.container > nav ul {
		list-style: none;
	}
	.container > nav ul ul {
		margin-left: 20px;
	}

	.content {
		grid-column: 2 / span 1;
	}
</style>
