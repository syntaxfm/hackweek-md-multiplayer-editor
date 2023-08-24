import { authorize } from '@liveblocks/node';

import { LIVEBLOCKS_SECRET } from '$env/static/private';
import { error } from '@sveltejs/kit';

export async function POST({ request }) {
	const { room } = await request.json();

	if (!LIVEBLOCKS_SECRET || !room) {
		throw error(403);
	}

	// For the avatar example, we're generating random users
	// and set their info from the authentication endpoint
	// See https://liveblocks.io/docs/api-reference/liveblocks-node#authorize for more information
	const response = await authorize({
		room: room,
		secret: LIVEBLOCKS_SECRET,
		userId: `user-${Math.floor(Math.random() * NAMES.length)}`,
		userInfo: {
			name: NAMES[Math.floor(Math.random() * NAMES.length)],
			picture: `https://liveblocks.io/avatars/avatar-${Math.floor(Math.random() * 30)}.png`
		}
	});

	return new Response(response.body, { status: response.status });
}

const NAMES = [
	'Charlie Layne',
	'Mislav Abha',
	'Tatum Paolo',
	'Anjali Wanda',
	'Jody Hekla',
	'Emil Joyce',
	'Jory Quispe',
	'Quinn Elton'
];
