<script lang="ts">
	import { clientSymbol, roomSymbol } from './symbols';
	import { LiveList } from '@liveblocks/client';
	import type { Client, Room } from '@liveblocks/client';
	import { getContext, onDestroy, setContext } from 'svelte';

	export let data: string;
	export let id: string;
	export let defaultPresence = () => ({});

	if (!id) {
		throw new Error('RoomProvider requires an id');
	}

	const client = getContext<Client>(clientSymbol);
	const list = new LiveList([data]);

	if (client) {
		const room = client.enter(id, { initialPresence: {}, initialStorage: list });

		setContext<Room>(roomSymbol, room);

		onDestroy(() => {
			client.leave(id);
		});
	}
</script>

<slot />
