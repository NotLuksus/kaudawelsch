import VocabTrainer from '@/components/VocabTrainer';
import { auth } from '@/lib/auth';
import { db } from '@/server/db';
import { vocabsTable } from '@/server/db/schema';
import { eq, and, lte } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function TrainerPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session?.user.id) {
    return redirect('/signin')
  }
  
  const vocabs = await db.query.vocabsTable.findMany({
    where: and(
      eq(vocabsTable.userId, session.user.id),
      lte(vocabsTable.nextReview, new Date())
    )
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 font-bold text-3xl">Weird German Dialect Trainer</h1>
      <VocabTrainer vocabs={vocabs} />
    </div>
  );
}
