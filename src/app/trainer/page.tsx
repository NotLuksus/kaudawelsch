import VocabTrainer from '@/components/VocabTrainer';
import { auth } from '@/lib/auth';
import { db } from '@/server/db';
import { vocabsTable } from '@/server/db/schema';
import { eq, and, lte } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { generateVocabsAction } from '@/server/actions/generateVocabs';
import { SignOutButton } from '@/components/SignOutButton';

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

  let nextDate;

  if(!vocabs.length) {
    const next = await db.select().from(vocabsTable).where(eq(vocabsTable.userId, session.user.id)).orderBy(vocabsTable.nextReview).limit(1);
    if(!next.length) {
      await generateVocabsAction({ count: 10 });
    }
    nextDate = next[0].nextReview;
  }
  return (
    <div className="relative container mx-auto px-4 py-8">
      <div className="absolute top-4 right-4">
        <SignOutButton />
      </div>
      <h1 className="mb-8 font-bold text-3xl">Kaudawelsch</h1>
      {nextDate && <p>Next review: {nextDate.toLocaleDateString()}</p>}
      <VocabTrainer vocabs={vocabs} />
    </div>
  );
}
