'use client';

import type { vocabsTable } from '@/server/db/schema';
import { useState } from 'react';
import VocabCard from './VocabCard';
import { useServerAction } from 'zsa-react';
import { removeVocabAction } from '@/server/actions/removeVocab';
import { generateVocabsAction } from '@/server/actions/generateVocabs';
import { updateVocab } from '@/server/actions/updateVocab';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';

export type SelectVocab = typeof vocabsTable.$inferSelect;

export default function VocabTrainer({ vocabs }: { vocabs: SelectVocab[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const { isPending: isPendingRemove, execute: executeRemove } = useServerAction(removeVocabAction);
 

  const checkAnswer = async () => {
    if (!vocabs[currentIndex]) return;
    
    const isAnswerCorrect = answer.toLowerCase() === vocabs[currentIndex].meaning.toLowerCase();
    setIsCorrect(isAnswerCorrect);
    
    await updateVocab({
      vocabId: vocabs[currentIndex].id,
      quality: isAnswerCorrect ? 5 : 2,
    });
  };

  const handleNext = () => {
    setIsDialogOpen(false);
    setAnswer('');
    setIsCorrect(null);
    setCurrentIndex((prev) => (prev + 1) % vocabs.length);
  };

  const handleSkip = () => {
    setIsDialogOpen(false);
    setAnswer('');
    setIsCorrect(null);
    setCurrentIndex((prev) => (prev + 1) % vocabs.length);
  };

  return (
    <div className="flex flex-col items-center">


      <div className="w-full max-w-md">
        {vocabs.length > 0 && (
          <div onClick={() => setIsDialogOpen(true)} className="cursor-pointer">
            <VocabCard 
              vocab={vocabs[currentIndex]} 
              onRemove={(id) => executeRemove({ id })} 
              isRemoving={isPendingRemove} 
            />
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>What's the standard German word?</DialogTitle>
            <DialogDescription>
              Dialect word: {vocabs[currentIndex]?.dialect}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4">
            <Input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isCorrect) {
                  checkAnswer();
                } else if (e.key === 'Enter' && isCorrect) {
                  handleNext();
                }
              }}
            />
            
            <div className="flex gap-2">
              {isCorrect === null && (
                <>
                  <Button onClick={checkAnswer} className="flex-1">
                    Check Answer
                  </Button>
                  <Button onClick={handleSkip} variant="outline" className="flex-1">
                    Skip
                  </Button>
                </>
              )}
            </div>
            
            {isCorrect !== null && (
              <div className="flex flex-col gap-2">
                <div className={`text-center font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                  {isCorrect ? 'Correct!' : 'Incorrect!'}
                </div>
                <div className="text-center">
                  The correct answer is: {vocabs[currentIndex]?.meaning}
                </div>
                <Button onClick={handleNext}>
                  Next Word
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
