import type { Actions, PageServerLoad } from './$types';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import highlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import matter from 'gray-matter';
import { fail } from '@sveltejs/kit';

const owner = 'syntaxfm';
const repo = 'hackweek-md-multiplayer-editor';
const baseBranch = 'main';

function prepare_content(content: string): string {
	return Buffer.from(content).toString('base64');
}

export const load: PageServerLoad = async function ({ cookies, params }) {
	const oauth_token = cookies.get('oauth');
	const { id } = params;
	const url = `https://api.github.com/repos/${owner}/${repo}/contents/src/shows/${id}`;

	const response = await fetch(url, {
		headers: {
			Authorization: `token ${oauth_token}`,
			'Cache-Control': 'no-cache'
		}
	});

	const json = await response.json();
	const cont = atob(json.content); // Decode base64 content

	const { data, content } = matter(cont);

	const body_excerpt = await unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeRaw)
		.use(highlight)
		.use(rehypeStringify)
		.process(content || '');

	return {
		notes: body_excerpt.toString(),
		meta: data,
		raw: cont,
		raw_notes: content,
		path: id
	};
};

export const actions: Actions = {
	publish: async ({ cookies, request }) => {
		const oauth_token = cookies.get('oauth');
		const { markdown_to_server, path } = await request.json();

		// Determine if the path has a .draft.md extension
		const isDraft = path.endsWith('.draft.md');
		const mainPath = isDraft ? path.replace('.draft.md', '.md') : path;
		const draftPath = isDraft ? path : path.replace('.md', '.draft.md');

		const content = prepare_content(markdown_to_server);

		const existingMainFileResponse = await fetch(
			`https://api.github.com/repos/${owner}/${repo}/contents/src/shows/${mainPath}`,
			{
				headers: { Authorization: `token ${oauth_token}` }
			}
		);
		console.log('existingMainFileResponse', existingMainFileResponse);

		let sha;
		if (existingMainFileResponse.status === 200) {
			const existingMainFile = await existingMainFileResponse.json();
			sha = existingMainFile.sha; // Get the SHA of the main file
		}

		// Update or create the main file (without .draft.md)
		const createOrUpdateMainFileResponse = await fetch(
			`https://api.github.com/repos/${owner}/${repo}/contents/src/shows/${mainPath}`,
			{
				method: 'PUT',
				headers: { Authorization: `token ${oauth_token}`, 'Content-Type': 'application/json' },
				body: JSON.stringify({
					message: `Update ${mainPath}`,
					content,
					branch: baseBranch,
					sha: sha // Include the SHA if updating
				})
			}
		);
		console.log('createOrUpdateMainFileResponse', createOrUpdateMainFileResponse);

		if (
			createOrUpdateMainFileResponse.status < 200 ||
			createOrUpdateMainFileResponse.status >= 300
		) {
			return fail(createOrUpdateMainFileResponse.status);
		}

		// If the original file was a draft, delete the draft file
		if (isDraft) {
			const existingDraftFileResponse = await fetch(
				`https://api.github.com/repos/${owner}/${repo}/contents/src/shows/${draftPath}`,
				{
					headers: { Authorization: `token ${oauth_token}` }
				}
			);
			if (existingDraftFileResponse.status === 200) {
				const existingDraftFile = await existingDraftFileResponse.json();
				console.log('existingDraftFile', existingDraftFile);
				const sha = existingDraftFile.sha; // Get the SHA of the draft file

				// Delete the draft file
				const deleteDraftFileResponse = await fetch(
					`https://api.github.com/repos/${owner}/${repo}/contents/src/shows/${draftPath}`,
					{
						method: 'DELETE',
						headers: { Authorization: `token ${oauth_token}`, 'Content-Type': 'application/json' },
						body: JSON.stringify({
							message: `Delete ${draftPath}`,
							sha: sha,
							branch: baseBranch
						})
					}
				);

				if (deleteDraftFileResponse.status < 200 || deleteDraftFileResponse.status >= 300) {
					return fail(deleteDraftFileResponse.status);
				}
			}
		}

		return { success: true };
	},
	draft: async ({ request, cookies }) => {
		const oauth_token = cookies.get('oauth');
		const { markdown_to_server, path } = await request.json();
		console.log('markdown_to_server', markdown_to_server);

		// Check if the path already ends with .draft.md
		const isDraft = path.endsWith('.draft.md');
		const draftPath = isDraft ? path : path.replace('.md', '.draft.md');
		const content = prepare_content(markdown_to_server);
		console.log('content', content);

		// Check if the file already exists (if it's a draft)
		let sha;
		if (isDraft) {
			const existingFileResponse = await fetch(
				`https://api.github.com/repos/${owner}/${repo}/contents/src/shows/${draftPath}`,
				{
					headers: { Authorization: `token ${oauth_token}` }
				}
			);
			if (existingFileResponse.status === 200) {
				const existingFile = await existingFileResponse.json();
				sha = existingFile.sha; // Get the SHA if the file exists
			}
		}

		// Create or update the file with a .draft.md suffix
		const createOrUpdateFileResponse = await fetch(
			`https://api.github.com/repos/${owner}/${repo}/contents/src/shows/${draftPath}`,
			{
				method: 'PUT',
				headers: { Authorization: `token ${oauth_token}`, 'Content-Type': 'application/json' },
				body: JSON.stringify({
					message: isDraft ? `Update ${draftPath}` : `Create ${draftPath}`,
					content,
					branch: baseBranch, // Using the same branch as the original file
					sha: sha // Include the SHA if updating
				})
			}
		);

		if (createOrUpdateFileResponse.status >= 200 && createOrUpdateFileResponse.status < 300) {
			return { success: true };
		} else {
			return fail(createOrUpdateFileResponse.status);
		}
	}
};
