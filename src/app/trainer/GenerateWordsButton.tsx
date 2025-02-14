'use client';

import { generateVocabsAction } from "@/server/actions/generateVocabs";
import { useServerAction } from "zsa-react";

export const GenerateWordsButton = () => {
   const { isPending: isPendingGenerate, execute: executeGenerate } = useServerAction(generateVocabsAction);
  return (
             <button 
        className="mb-8 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:opacity-50" 
        disabled={isPendingGenerate} 
        onClick={() => executeGenerate({ count: 10 })}
      >
        Generate More Words
      </button>
  )
}