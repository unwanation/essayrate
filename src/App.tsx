import { Loader2, Pen } from 'lucide-react';
import { useState } from 'react';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from './components/ui/accordion';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Separator } from './components/ui/separator';
import { Textarea } from './components/ui/textarea';
import { EssayRating, evaluateEssay } from './services/evaluate.service';
import { extractText } from './services/extract.service';

function App() {
	const [status, setStatus] = useState<
		'idle' | 'pending' | 'success' | 'error'
	>('idle');

	const [essay, setEssay] = useState('');
	const [source, setSource] = useState('');
	const [results, setResults] = useState<EssayRating | null>(null);

	return (
		<main className='bg-zinc-50 text-black dark:bg-zinc-950 dark:text-white flex min-h-screen flex-col items-center justify-center p-10 gap-4'>
			{status == 'success' ? (
				<div className='w-full'>
					<h1 className='text-2xl font-bold'>
						Итоговый балл: {results!.totalScore}
					</h1>
					<p className='text-sm'>{results!.remark}</p>

					<h2 className='text-xl font-bold mt-4 mb-2'>Критерии</h2>
					<Accordion
						type='single'
						collapsible
						className='w-full space-y-2'
						defaultValue='3'
					>
						{[...Array(10)].map((_, i) => (
							<AccordionItem
								value={`K${i + 1}`}
								key={i}
								className='rounded-lg border bg-background px-4 py-1'
							>
								<AccordionTrigger className='py-2 text-[15px] leading-6 hover:no-underline'>
									{/* @ts-expect-error верь мне брат */}K
									{i + 1} - {results![`K${i + 1}`]}
								</AccordionTrigger>
								<AccordionContent className='pb-2'>
									{/* @ts-expect-error верь мне брат */}
									{results![`K${i + 1}_comment`]}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
					<Button
						className='mt-4 w-full'
						variant='destructive'
						onClick={() => window.location.reload()}
					>
						Назад
					</Button>
				</div>
			) : (
				<div className='flex w-full flex-col gap-4'>
					<div className='grid w-full gap-1.5'>
						<Label htmlFor='source'>Оригинальный текст</Label>
						<Textarea
							value={source}
							onChange={e => setSource(e.target.value)}
							placeholder='Введите оригинальный текст здесь...'
							id='source'
						/>
					</div>
					<Separator />
					<div className='grid w-full gap-1.5'>
						<Label htmlFor='essay'>Сочинение</Label>
						<Textarea
							value={essay}
							onChange={e => setEssay(e.target.value)}
							placeholder='Введите ваше сочинение здесь...'
							id='essay'
						/>
						<Input
							onChange={async e => {
								const file = e.target.files?.[0];
								if (file) {
									const response = await extractText(file);
									setEssay(response.text);
								}
							}}
							id='picture'
							type='file'
						/>
						<em className='text-zinc-500 text-sm'>
							Текст с фото вставится в поле сверху
						</em>
					</div>
					{status == 'pending' ? (
						<Button disabled>
							<Loader2 className='animate-spin' />
							Работа проверяется...
						</Button>
					) : (
						<Button
							onClick={async () => {
								setStatus('pending');
								const response = await evaluateEssay(
									source,
									essay
								);
								const data = JSON.parse(response);
								setResults(data);
								console.log(data);
								if (response.error) {
									setStatus('error');
								} else setStatus('success');
							}}
						>
							<Pen /> Проверить работу
						</Button>
					)}
				</div>
			)}
		</main>
	);
}

export default App;
