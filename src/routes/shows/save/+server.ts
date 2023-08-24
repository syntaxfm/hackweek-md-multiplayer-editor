// import { error, fail, json } from '@sveltejs/kit';

// const owner = 'stolinski';
// const repo = 'syntax-notes';
// const baseBranch = 'main';
// export async function POST({ request, cookies }) {
// 	const oauth_token = cookies.get('oauth');
// 	const { markdown_to_server, message, data } = await request.json();
// 	const { path } = data;
// 	const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
// 	// Define the path for the new draft file
// 	const draftPath = path.replace('.md', '.draft.md');

// 	// Create the new file with a .draft.md suffix
// 	const createFileResponse = await fetch(
// 		`https://api.github.com/repos/${owner}/${repo}/contents/${draftPath}`,
// 		{
// 			method: 'PUT',
// 			headers: { Authorization: `token ${oauth_token}`, 'Content-Type': 'application/json' },
// 			body: JSON.stringify({
// 				message: `Create ${draftPath}`,
// 				content: Buffer.from(markdown_to_server).toString('base64'),
// 				branch: baseBranch // Using the same branch as the original file
// 			})
// 		}
// 	);

// 	if (createFileResponse.status >= 200 && createFileResponse.status < 300) {
// 		return json('good');
// 	} else {
// 		throw error(createFileResponse.status, '😞');
// 	}
// }
