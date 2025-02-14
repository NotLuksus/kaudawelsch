'use client';

import type { vocabsTable } from '@/server/db/schema';
import { useState } from 'react';
import VocabCard from './VocabCard';
import { useServerAction } from 'zsa-react';
import { removeVocabAction } from '@/server/actions/removeVocab';
import { generateVocabsAction } from '@/server/actions/generateVocabs';


export type SelectVocab = typeof vocabsTable.$inferSelect;

export default function VocabTrainer({ vocabs }: { vocabs: SelectVocab[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isPending: isPendingRemove, execute: executeRemove } = useServerAction(removeVocabAction);
  const { isPending: isPendingGenerate, execute: executeGenerate } = useServerAction(generateVocabsAction);

  return (
    <div className="flex flex-col items-center">
      <button className="mb-8 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:opacity-50" disabled={isPendingGenerate} onClick={() => executeGenerate({ count: 10 })}>
        Generate More Words
      </button>

      <div className="w-full max-w-md">
        {vocabs.length > 0 && (
          <VocabCard vocab={vocabs[currentIndex]} onRemove={(id) => executeRemove({ id })} isRemoving={isPendingRemove} />
        )}
      </div>

      <div className="mt-8 flex gap-4">
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
        >
          Previous
        </button>
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={() =>
            setCurrentIndex((prev) => Math.min(vocabs.length - 1, prev + 1))
          }
          disabled={currentIndex === vocabs.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
