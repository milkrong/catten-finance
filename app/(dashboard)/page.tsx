'use client';

import { useNewAccountStore } from '@/features/accounts/hooks/use-new-accounts';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { onOpen } = useNewAccountStore();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button onClick={onOpen}>Add an account</Button>
      Home
    </main>
  );
}
