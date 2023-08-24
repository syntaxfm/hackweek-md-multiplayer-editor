export async function get_repo_file(fileUrl: string) {
	const response = await fetch(fileUrl);

	if (!response.ok) {
		throw new Error(`Error fetching file content: ${response.status}`);
	}

	const content = await response.text();
	return content;
}
