'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteCategory } from '@/features/categories/api/use-delete-category';
import { useEditCategoryStore } from '@/features/categories/hooks/use-edit-category';
import { useConfirm } from '@/hooks/use-confirm';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';

type EditCategoryActionProps = {
  id: string;
};
export const CategoryAction = ({ id }: EditCategoryActionProps) => {
  const { onOpen } = useEditCategoryStore();
  const deleteMutation = useDeleteCategory(id);
  const [DeleteConfirmation, deleteConfirm] = useConfirm(
    'Are you sure you want to delete this category?',
    'This action cannot be undone.'
  );
  const handleDelete = async () => {
    const confirm = await deleteConfirm();
    if (confirm) {
      deleteMutation.mutate();
    }
  };
  return (
    <>
      <DeleteConfirmation />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className=" " />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={() => onOpen(id)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
          >
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
