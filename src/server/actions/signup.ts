'use server';

import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { createServerAction } from 'zsa';

export const signupAction = createServerAction()
  .input(
    z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(8),
    })
  )
  .handler(async ({ input }) => {
    try {
      await auth.api.signUpEmail({
        body: {
          name: input.name,
          email: input.email,
          password: input.password,
        },
      });
    } catch (error) {
      // biome-ignore lint/style/useThrowOnlyError: <explanation>
      throw 'Failed to create account';
    }
    revalidatePath('/', 'layout');
  });
