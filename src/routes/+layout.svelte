<script lang="ts">
	import './style.css';
	let dark = false;
</script>

<div class="wrapper" class:dark>
	<header>
		<nav>
			<a href="/shows">◀️ Shows</a>
			<button on:click={() => (dark = !dark)}>
				<span>☀️</span>
				<span>🌚</span>
			</button>
		</nav>
	</header>

	<slot />
</div>

<style>
	header {
		padding: 20px;
	}

	.wrapper,
	header,
	button,
	:global(input) {
		background: var(--color-background);
		color: var(--color-foreground);
	}

	.dark {
		--color-background: black;
		--color-foreground: white;
		--color-primary: var(--yellow);
		--color-primary-faded: black;
		--color-background-preview: #111;
		--shadow: none;
	}
</style>
