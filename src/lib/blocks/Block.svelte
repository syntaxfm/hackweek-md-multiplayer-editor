<script lang="ts">
	import type { LiveList } from '@liveblocks/client';
	import Avatar from '$lib/Avatar.svelte';
	import { fade } from 'svelte/transition';
	import { parse_line_display } from '$lib/parse_line_display';
	import { onMount } from 'svelte';

	export let room;
	export let line_number = '';
	export let doc: LiveList<string>;

	// The actual md line of text
	export let text: string;
	export let is_typing;

	let focused: HTMLElement | null = null;
	let display_text = '';
	let display_element = 'p';
	let leading_text = '';

	$: {
		[display_element, display_text, leading_text] = parse_line_display(text);
	}

	function on_input(e: Event & { currentTarget: HTMLDivElement }, i: number) {
		e.preventDefault();
		room.updatePresence({ isTyping: true, on_line: i });
		doc.set(i, e.currentTarget.innerText);
	}

	function on_focus(e) {
		focused = e.currentTarget;
	}

	function on_blur() {
		focused = null;
		room.updatePresence({
			isTyping: false,
			on_line: -1
		});
	}

	function focus_input(element: HTMLElement) {
		element.focus();
		const range = document.createRange();
		const selection = window.getSelection();
		range.selectNodeContents(element);
		range.collapse(false); // Move the cursor to the end

		if (selection) {
			selection.removeAllRanges();
			selection.addRange(range);
		}
	}

	function remove_line(i: number) {
		doc.delete(i);
	}

	function new_line(event, i: number) {
		doc.insert('', i + 1);
		setTimeout(() => {
			// Refocus the contenteditable element after DOM changes
			event.currentTarget.closest('.block').nextElementSibling.querySelector('.input').focus();
		}, 10);
		// event.currentTarget.parentNode.nextElementSibling.children[1].focus();
	}

	function handleKeydown(event) {
		if (event.key === 'Enter') {
			event.preventDefault(); // Prevents adding a new line in the contenteditable div

			new_line(event, Number(line_number));
			// Add your custom logic here
		}
		// if event is up arrow
		if (event.key === 'ArrowUp') {
			event.preventDefault();
			const input = event.currentTarget
				.closest('.block')
				.previousElementSibling.querySelector('.input');
			focus_input(input);
		}
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			const input = event.currentTarget
				.closest('.block')
				.nextElementSibling.querySelector('.input');
			focus_input(input);
		}
		// If backspace and the contenteditable div is empty
		if (event.key === 'Backspace' && event.currentTarget.innerText === '') {
			event.preventDefault();
			remove_line(Number(line_number));
			const input = event.currentTarget
				.closest('.block')
				.previousElementSibling.querySelector('.input');
			focus_input(input);
		}
	}

	onMount(() => {
		console.log('line_number', line_number);
	});
</script>

<div class={`block line-type-${display_element}`}>
	<span class="line">
		{#if String(is_typing?.presence?.on_line) === line_number}
			<div class="is_typing_avatar" transition:fade>
				<Avatar avatar_size={30} picture={is_typing.info?.picture} name={is_typing.info?.name} />
			</div>
		{:else}
			{'#' + line_number}
		{/if}
	</span>
	<div class={display_element}>
		<span
			class="input"
			contenteditable="true"
			on:focus={on_focus}
			on:blur={on_blur}
			on:input={(e) => on_input(e, Number(line_number))}
			on:keydown={handleKeydown}>{text}</span
		>
	</div>
</div>

<style>
	.block {
		display: grid;
		grid-template-columns: 30px 1fr;
		outline: 1px solid transparent;
		line-height: 1.5;
		font-size: 16px;
		align-items: baseline;
		border-radius: 4px;
		padding: 0 5px;
	}

	.is_typing_avatar {
		position: absolute;
		top: -2px;
		left: -13px;
	}

	.line {
		display: block;
		color: var(--color-primary-faded);
		font-size: 12px;
		position: relative;
		height: 100%;
	}

	.block:has(.input:focus) {
		outline-color: #ddd;
		box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1), 0px 0px 0px 1px rgba(0, 0, 0, 0.05);
	}

	.input:focus {
		outline: none;
	}

	span {
		display: block;
	}

	.h1 {
		border-bottom: solid 1px var(--color-primary-faded);
	}

	.line-type-h1,
	.line-type-h2 {
		margin-block-start: 0.83em;
		margin-block-end: 0.83em;
	}
	.line-type-h3,
	.line-type-h6 {
		margin-block-start: 1em;
		margin-block-end: 1em;
	}
	.line-type-h4 {
		margin-block-start: 1.33em;
		margin-block-end: 1.33em;
	}
	.line-type-h5 {
		margin-block-start: 1.67em;
		margin-block-end: 1.67em;
	}
</style>
