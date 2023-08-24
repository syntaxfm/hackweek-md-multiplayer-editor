<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	$: ({ user, files } = data);
</script>

{#if user}
	{#if files}
		<ul>
			{#each files as file}
				<li>
					<a href={`/shows/${file.name}`}>
						{#if file.name.includes('draft')}
							<span> DRAFT </span>
						{/if}
						{file.name}
					</a>
				</li>
			{/each}
		</ul>
	{/if}
{/if}

<style>
	span {
		background: var(--color-background-preview-dark);
		color: var(--color-foreground-primary-dark);
		display: inline-block;
		border-radius: 5px;
		padding: 2px 5px;
	}
</style>
