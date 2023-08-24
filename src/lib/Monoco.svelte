<script lang="ts">
	import { unified } from 'unified';
	import rehypeParse from 'rehype-parse';
	import remarkStringify from 'remark-stringify';
	import rehypeRemark from 'rehype-remark';
	import { html_to_markdown } from './html_to_markdown';
	// import TurndownService from 'turndown';

	export let meta;
	export let notes;
	export let raw;

	let is_edited = false;

	let local_raw = raw;

	function save() {
		console.log('Saving notes...');
	}

	$: if (raw !== local_raw) {
		is_edited = true;
	}

	const html_input = '<h1>Hello, World!</h1>';
	html_to_markdown(html_input).then((data) => {
		console.log(data);
	});
</script>

{#if is_edited}
	<div>I've been edited</div>
	<button on:click={save}>Save</button>
{/if}

<textarea name="" id="" cols="30" rows="10" bind:value={local_raw} />

<div>
	{meta}

	{notes}
</div>

<style>
	textarea {
		width: 100%;
	}
</style>
