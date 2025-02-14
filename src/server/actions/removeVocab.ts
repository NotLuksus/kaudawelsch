'use server';

import { auth } from '@/lib/auth';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { createServerAction } from 'zsa';
import { db } from '../db';
import { vocabsTable } from '../db/schema';
import { headers } from 'next/headers';

export const removeVocabAction = createServerAction()
  .input(
    z.object({
     id: z.number()
    })
  )
  .handler(async ({ input }) => {
    try {
      const session = await auth.api.getSession({
        headers: await headers()
      })
      if (!session?.user.id) {
        throw 'Not logged in';
      }
      await db.delete(vocabsTable).where(and(eq(vocabsTable.id, input.id), eq(vocabsTable.userId, session.user.id)));
    } catch (error) {
      // biome-ignore lint/style/useThrowOnlyError: <explanation>
      throw 'Invalid email or password';
    }
    revalidatePath('/', 'layout');
  });
