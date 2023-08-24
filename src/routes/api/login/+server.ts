import { PUBLIC_GITHUB_ID } from '$env/static/public';
const ghAuthURL = 'https://github.com/login/oauth/authorize';

export async function GET() {
	const sessionId = '1234';

	return new Response('', {
		status: 302,
		headers: {
			location: `${ghAuthURL}?client_id=${PUBLIC_GITHUB_ID}&state=${sessionId}`
		}
	});
}
