<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ user } = data);
</script>

{#if user?.login}
	<a href="/shows">See your shows</a>
{:else}
	<a href="/api/login">Login</a>
{/if}
