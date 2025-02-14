'use server';

import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { createServerAction } from 'zsa';

export const signinAction = createServerAction()
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(8),
    })
  )
  .handler(async ({ input }) => {
    try {
      await auth.api.signInEmail({
        body: {
          email: input.email,
          password: input.password,
        },
      });
    } catch (error) {
      // biome-ignore lint/style/useThrowOnlyError: <explanation>
      throw 'Invalid email or password';
    }
    revalidatePath('/', 'layout');
  });
