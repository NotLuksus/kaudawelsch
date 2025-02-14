'use client';

import { useState } from 'react';
import type { SelectVocab } from './VocabTrainer';

interface VocabCardProps {
  vocab: SelectVocab;
  onRemove: (id: number) => void;
  isRemoving: boolean;
}

export default function VocabCard({ vocab, onRemove, isRemoving }: VocabCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative h-64 w-full perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className={`absolute w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front of card */}
        <div className="absolute w-full h-full bg-white rounded-lg shadow-lg p-6 backface-hidden">
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-2xl font-bold mb-2">{vocab.dialect}</p>
            <p className="text-gray-600">(Hover to reveal)</p>
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute w-full h-full bg-white rounded-lg shadow-lg p-6 backface-hidden rotate-y-180">
          <div className="flex flex-col items-center justify-center h-full">
            <button 
              onClick={() => onRemove(vocab.id)}
              disabled={isRemoving}
              className="absolute top-2 right-2 text-red-500 hover:text-red-600 disabled:opacity-50"
            >
              ✕
            </button>
            <p className="text-xl mb-2">Meaning: {vocab.meaning}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
