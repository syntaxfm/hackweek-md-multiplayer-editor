import { get_repo_files } from '$lib/get_repo_files';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async function ({ cookies }) {
	const oauth_token = cookies.get('oauth');
	if (oauth_token) {
		const files = await get_repo_files(oauth_token);

		return {
			files
		};
	}
};
