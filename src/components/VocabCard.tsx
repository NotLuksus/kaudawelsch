'use client';

import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';
import type { SelectVocab } from './VocabTrainer';

interface VocabCardProps {
  vocab: SelectVocab;
  onRemove: (id: number) => void;
  isRemoving: boolean;
}

export default function VocabCard({ vocab, onRemove, isRemoving }: VocabCardProps) {
  return (
    <div className="relative rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-semibold">{vocab.dialect}</h3>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(vocab.id);
          }}
          disabled={isRemoving}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
