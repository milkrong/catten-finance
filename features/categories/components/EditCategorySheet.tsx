import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useEditCategoryStore } from '@/features/categories/hooks/use-edit-category';
import { CategoryForm, FormValues } from './CategoryForm';
import { useEditCategory } from '@/features/categories/api/use-edit-category';
import { useGetCategory } from '@/features/categories/api/use-get-category';
import { Loader2 } from 'lucide-react';
import { useDeleteCategory } from '@/features/categories/api/use-delete-category';
import { useConfirm } from '@/hooks/use-confirm';

export const EditCategorySheet = () => {
  const { id, isOpen, onClose } = useEditCategoryStore();
  const categoryQuery = useGetCategory(id);
  const mutation = useEditCategory(id);
  const deleteMutation = useDeleteCategory(id);
  const [DeleteConfirmation, deleteConfirm] = useConfirm(
    'Are you sure you want to delete this category?',
    'This action cannot be undone.'
  );
  const handleSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };
  const handleDelete = async () => {
    const confirm = await deleteConfirm();
    if (confirm) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };
  const defaultValues = categoryQuery.data
    ? { name: categoryQuery.data.name }
    : { name: '' };

  const isPending = mutation.isPending;

  return (
    <>
      <DeleteConfirmation />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit category</SheetTitle>
          </SheetHeader>
          <SheetDescription>Edit category details.</SheetDescription>
          {categoryQuery.isLoading ? (
            <div className="absolute inset-0 flex justify-center items-center h-full">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <CategoryForm
              id={id}
              onSubmit={handleSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={handleDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
