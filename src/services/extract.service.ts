export async function extractText(image: File) {
	const formData = new FormData();
	formData.append('file', image);

	const response = await fetch(
		'https://essayrate-server.unwanation.workers.dev/extract',
		{
			method: 'POST',
			body: formData,
		}
	);

	return response.json();
}
