'use client';

import { useNewCategoryStore } from '@/features/categories/hooks/use-new-category';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { onOpen } = useNewCategoryStore();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button onClick={onOpen}>Add a category</Button>
      Home
    </main>
  );
}
