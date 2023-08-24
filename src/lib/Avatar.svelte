<script>
	export let picture = '';
	export let name = '';

	export let avatar_size = 40;
</script>

<div style:--avatar_size={avatar_size} class="avatar" data-tooltip={name}>
	<img alt="Avatar" class="avatar_picture" height={avatar_size} src={picture} width={avatar_size} />
</div>

<style>
	.avatar {
		--avatar_size: 40;
		display: flex;
		place-content: center;
		align-items: center;
		position: relative;
		border-radius: var(--avatar_size);
		width: var(--avatar_size);
		height: var(--avatar_size);
	}

	.avatar:before {
		content: attr(data-tooltip);
		position: absolute;
		bottom: 100%;
		opacity: 0;
		transition: opacity 0.15s ease;
		padding: 5px 10px;
		color: white;
		font-size: 0.75rem;
		border-radius: 8px;
		margin-bottom: 10px;
		z-index: 1;
		background: black;
		white-space: nowrap;
	}

	.avatar:hover:before {
		opacity: 1;
	}

	.avatar_picture {
		border-radius: 9999px;
	}
</style>
