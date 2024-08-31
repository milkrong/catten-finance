import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useEditAccountStore } from '@/features/accounts/hooks/use-edit-account';
import { AccountForm, FormValues } from './AccountForm';
import { useEditAccount } from '@/features/accounts/api/use-edit-account';
import { useGetAccount } from '@/features/accounts/api/use-get-account';
import { Loader2 } from 'lucide-react';
import { useDeleteAccount } from '@/features/accounts/api/use-delete-account';
import { useConfirm } from '@/hooks/use-confirm';

export const EditAccountSheet = () => {
  const { id, isOpen, onClose } = useEditAccountStore();
  const accountQuery = useGetAccount(id);
  const mutation = useEditAccount(id);
  const deleteMutation = useDeleteAccount(id);
  const [DeleteConfirmation, deleteConfirm] = useConfirm(
    'Are you sure you want to delete this account?',
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
  const defaultValues = accountQuery.data
    ? { name: accountQuery.data.name }
    : { name: '' };

  const isPending = mutation.isPending;

  return (
    <>
      <DeleteConfirmation />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit account</SheetTitle>
          </SheetHeader>
          <SheetDescription>Edit account details.</SheetDescription>
          {accountQuery.isLoading ? (
            <div className="absolute inset-0 flex justify-center items-center h-full">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <AccountForm
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
