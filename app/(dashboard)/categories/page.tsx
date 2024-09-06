'use client';

import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNewCategoryStore } from '@/features/categories/hooks/use-new-category';
import { Loader2, Plus } from 'lucide-react';
import { columns } from './columns';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { Skeleton } from '@/components/ui/skeleton';
import { useBulkDeleteCategories } from '@/features/categories/api/use-bulk-delete';

export default function CategoriesPage() {
  const newCategory = useNewCategoryStore();
  const categoryQuery = useGetCategories();
  const bulkDelete = useBulkDeleteCategories();
  const categories = categoryQuery.data || [];
  const isDisabled = categoryQuery.isLoading || bulkDelete.isPending;
  if (categoryQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-19 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="animate-spin size-6 text-slate-300" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-19 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-lg line-clamp-1">Categories</CardTitle>
          <Button size="sm" onClick={newCategory.onOpen}>
            <Plus className="size-4 mr-2" />
            Add Category
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="name"
            data={categories}
            columns={columns}
            onDelete={(rows) => {
              bulkDelete.mutate({
                ids: rows.map((row) => row.original.id) as string[],
              });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
}
