import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const userURL = 'https://api.github.com/user';

export const oauth: Handle = async function ({ event, resolve }) {
	const oauth: string = event.cookies.get('oauth');
	const user = await getUser(oauth);

	event.locals.user = user;
	const response = await resolve(event);
	return response;
};

export const handle: Handle = sequence(oauth);

function getUser(accessToken: string) {
	return fetch(userURL, {
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${accessToken}`
		}
	}).then((r) => r.json());
}
