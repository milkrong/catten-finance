import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useNewAccountStore } from '@/features/accounts/hooks/use-new-accounts';
import { AccountForm, FormValues } from './AccountForm';
import { useCreateAccount } from '@/features/accounts/api/use-create-account';

export const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccountStore();
  const mutation = useCreateAccount();
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
          <SheetTitle>Add a new account</SheetTitle>
        </SheetHeader>
        <SheetDescription>
          Add a new account to your dashboard.
        </SheetDescription>
        <AccountForm
          onSubmit={handleSubmit}
          disabled={mutation.isPending}
          defaultValues={{ name: '' }}
        />
      </SheetContent>
    </Sheet>
  );
};
