'use client';

import { signoutAction } from '@/server/actions/signout';
import { toast } from 'sonner';
import { useServerAction } from 'zsa-react';
import { DropdownMenuItem } from './ui/dropdown-menu';

export function SignOutButton() {
  const { execute } = useServerAction(signoutAction);

  const handleSignOut = async () => {
    const [_, err] = await execute();

    if (err) {
      toast.error(err.message ?? 'Something went wrong');
    } else {
      toast.success('Signed out successfully');
    }
  };

  return <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>;
}
