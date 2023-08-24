import matter from 'gray-matter';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

const owner = 'stolinski';
const repo = 'syntax-notes';
const baseBranch = 'main';

export const actions: Actions = {
	rename_all: async ({ cookies }) => {
		const oauth_token = cookies.get('oauth');
		if (oauth_token) {
			await renameMarkdownFiles(oauth_token);
			return {
				success: true
			};
		}
		return fail(401, {
			message: 'Unauthorized'
		});
	}
};

async function renameMarkdownFiles(oauth_token: string): Promise<void> {
	try {
		const directoryUrl = `https://api.github.com/repos/${owner}/${repo}/contents/src/shows/`;

		// Fetch the list of files in the directory
		const response = await fetch(directoryUrl, {
			headers: { Authorization: `token ${oauth_token}` }
		});
		if (response.status < 200 || response.status >= 300) {
			throw new Error('Not authorized');
		}
		const files: any[] = await response.json();

		// Filter markdown files
		const markdownFiles = files.filter((file) => file.path.endsWith('.md'));

		// Iterate through markdown files and rename them
		for (const file of markdownFiles) {
			// Fetch the content of the file
			const fileResponse = await fetch(file.url, {
				headers: { Authorization: `token ${oauth_token}` }
			});
			const fileContent: { content: string; sha: string } = await fileResponse.json();
			const content = Buffer.from(fileContent.content, 'base64').toString('utf8');

			// Parse the frontmatter using gray-matter
			const frontmatter = matter(content).data;

			// Construct the new file name
			const number = String(frontmatter.number || '').padStart(4, '0'); // Format number with leading zeros
			const title = encodeURIComponent(frontmatter.title || ''); // Encode title to make it safe for file names
			const date = frontmatter.date || '';
			const newFileName = `${number}-${date}-${title}.md`;

			// Update the file name on GitHub
			const updateResponse = await fetch(directoryUrl + newFileName, {
				method: 'PUT',
				headers: { Authorization: `token ${oauth_token}`, 'Content-Type': 'application/json' },
				body: JSON.stringify({
					message: `Rename ${file.name} to ${newFileName}`,
					content: fileContent.content,
					sha: fileContent.sha
				})
			});

			// Check for success
			if (updateResponse.status < 200 || updateResponse.status >= 300) {
				console.error(`Failed to rename ${file.name} to ${newFileName}`);
			}
		}
	} catch (error) {
		console.error('error', error);
	}
}
