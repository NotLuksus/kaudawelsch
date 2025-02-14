'use server';

import { auth } from '@/lib/auth';
import { createGroq } from '@ai-sdk/groq';
import { generateObject } from 'ai';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { z } from 'zod';
import { createServerAction } from 'zsa';
import { db } from '../db';
import { vocabsTable } from '../db/schema';
const groq = createGroq();

export const generateVocabsAction = createServerAction()
  .input(
    z.object({
      count: z.number().min(1).max(100),
    })
  )
  .handler(async ({ input }) => {
    const headersList = await headers();
    try {
      const session = await auth.api.getSession({
        headers: headersList,
      });
      if (!session) {
        throw new Error('Unauthorized');
      }

      const currentVocabs = await db.query.vocabsTable.findMany({
        where: eq(vocabsTable.userId, session.user.id),
      });

      const prompt = `Generate ${input.count} funny German vocabulary entries. Return only a JSON array with objects containing:
    {
      "standard": "the standard German word",
      "dialect": "a made-up funny dialect version",
      "meaning": "English translation"
    }
    
    Rules for the dialect words:
    - Use common German words a beginner would learn
    - Make them pronounceable but completely made up
    - Add silly suffixes like '-wump', '-zeln', '-puff'
    - Use excessive compound words
    - Add exaggerated umlauts
    - Keep it somewhat believable as a regional variant

    EXISTING VOCABS:
    ${currentVocabs.map((vocab) => `${vocab.dialect}: ${vocab.meaning}`).join('\n')}

    
    Example:
    {
      "vocabs": [
        {
          "dialect": "Wuffelpump",
          "meaning": "dog"
        }
      ]
    }`;

      const { object } = await generateObject({
        model: groq('llama-3.1-8b-instant'),
        schema: z.object({
          vocabs: z.array(
            z.object({
              dialect: z.string(),
              meaning: z.string(),
            })
          ),
        }),
        prompt,
      });

      const newVocabs = object.vocabs.map((vocab) => ({
        dialect: vocab.dialect,
        meaning: vocab.meaning,
        userId: session.user.id,
      }));

      await db.insert(vocabsTable).values(newVocabs);
    } catch (error) {
      // biome-ignore lint/style/useThrowOnlyError: <explanation>
      throw 'Failed to generate vocabs';
    }
    revalidatePath('/', 'layout');
  });
