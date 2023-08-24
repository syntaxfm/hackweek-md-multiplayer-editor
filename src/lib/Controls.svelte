<script lang="ts">
	import type { Editor } from '@tiptap/core';

	export let editor: Editor;
	export let top_pos: number;
</script>

<div class="editbar" style:top={top_pos + -100 + 'px'}>
	{#if editor}
		<button
			on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
			class:active={editor.isActive('heading', { level: 1 })}
		>
			H1
		</button>
		<button
			on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
			class:active={editor.isActive('heading', { level: 2 })}
		>
			H2
		</button>
		<button
			on:click={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
			class:active={editor.isActive('heading', { level: 3 })}
		>
			H3
		</button>
		<button
			on:click={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
			class:active={editor.isActive('heading', { level: 4 })}
		>
			H4
		</button>
		<button
			on:click={() => editor.chain().focus().setParagraph().run()}
			class:active={editor.isActive('paragraph')}
		>
			P
		</button>
		<button
			on:click={() => editor.chain().focus().toggleBold().run()}
			class:active={editor.isActive('bold')}
		>
			Bold
		</button>
		<button
			on:click={() => editor.chain().focus().toggleBulletList().run()}
			class:active={editor.isActive('bulletList')}
		>
			•
		</button>
		<button
			on:click={() => editor.chain().focus().toggleOrderedList().run()}
			class:active={editor.isActive('orderedList')}
		>
			1.
		</button>
	{/if}
</div>

<style>
	.editbar {
		position: absolute;
		background-color: white;
		z-index: 100;
		left: 10px;
		box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1), 0px 0px 0px 1px rgba(0, 0, 0, 0.05), var(--shadow-6);
		border-radius: 4px;
		transition: 0.3s ease opacity;
		display: flex;
		overflow: hidden;
	}

	button {
		padding: 10px 15px;
		border: none;
	}

	button + button {
		border-left: 1px solid #000;
	}

	button.active {
		background: black;
		color: white;
	}
</style>
