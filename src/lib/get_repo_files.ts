import { SHOW_REPO_URL } from '$lib/constants';

export async function get_repo_files(token: string) {
	const response = await fetch(SHOW_REPO_URL, {
		headers: {
			Authorization: `token ${token}`,
			Accept: 'application/vnd.github+json'
		}
	});

	if (!response.ok) {
		const headers = response.headers;
		const resetTimestamp = parseInt(headers.get('x-ratelimit-reset') || '0', 10);
		const resetDate = new Date(resetTimestamp * 1000); // Convert to milliseconds
		const now = new Date();
		const timeRemaining = resetDate.getTime() - now.getTime();

		console.log(`Rate limit will reset at ${resetDate}`);
		console.log(`Time remaining: ${timeRemaining / 60000} minutes`);
		throw new Error(`Error fetching repository content: ${response.status}`);
	}

	const data = await response.json();
	return data;
}
