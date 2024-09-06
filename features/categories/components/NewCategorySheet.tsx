import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useNewCategoryStore } from '@/features/categories/hooks/use-new-category';
import { CategoryForm, FormValues } from './CategoryForm';
import { useCreateCategory } from '@/features/categories/api/use-create-category';

export const NewCategorySheet = () => {
  const { isOpen, onClose } = useNewCategoryStore();
  const mutation = useCreateCategory();
  const handleSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Add a new category</SheetTitle>
        </SheetHeader>
        <SheetDescription>
          Add a new category to your dashboard.
        </SheetDescription>
        <CategoryForm
          onSubmit={handleSubmit}
          disabled={mutation.isPending}
          defaultValues={{ name: '' }}
        />
      </SheetContent>
    </Sheet>
  );
};
