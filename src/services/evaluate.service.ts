export async function evaluateEssay(sourceText: string, essay: string) {
	const response = await fetch(
		'https://essayrate-server.unwanation.workers.dev/evaluate',
		{
			method: 'POST',
			body: JSON.stringify({ sourceText, essay }),
		}
	);

	return response.json();
}

export interface EssayRating {
	K1: 0 | 1;
	K2: 0 | 1 | 2 | 3;
	K3: 0 | 1 | 2;
	K4: 0 | 1;
	K5: 0 | 1 | 2;
	K6: 0 | 1;
	K7: 0 | 1 | 2 | 3;
	K8: 0 | 1 | 2 | 3;
	K9: 0 | 1 | 2 | 3;
	K10: 0 | 1 | 2 | 3;
	totalScore: number;
	remark: string;
}
