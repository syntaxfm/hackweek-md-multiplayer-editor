<script lang="ts">
	import Tip from '$lib/Tip.svelte';
	export let data;
	$: ({ meta, notes, raw, raw_notes, path } = data);
</script>

<div class="container">
	<Tip {meta} {notes} {raw} {raw_notes} {path} />
</div>
