'use server';

import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { createServerAction } from 'zsa';

export const signoutAction = createServerAction().handler(async () => {
  const headersList = await headers();
  try {
    await auth.api.signOut({
      headers: headersList,
    });
  } catch (error) {
    // biome-ignore lint/style/useThrowOnlyError: <explanation>
    throw 'Failed to sign out';
  }
  revalidatePath('/', 'layout');
});
