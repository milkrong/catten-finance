import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useNewTransactionStore } from "@/features/transactions/hooks/use-new-transaction";
import { TransactionForm, FormValues, ApiFormValues } from "./TransactionForm";
import { useCreateTransaction } from "@/features/transactions/api/use-create-transaction";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { Loader2 } from "lucide-react";

export const NewTransactionSheet = () => {
  const { isOpen, onClose } = useNewTransactionStore();
  const createTransactionMutation = useCreateTransaction();
  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => {
    categoryMutation.mutate({ name });
  };
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => {
    accountMutation.mutate({ name });
  };
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const isLoading = categoryQuery.isLoading || accountQuery.isLoading;

  const handleSubmit = (values: ApiFormValues) => {
    createTransactionMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Add a new transaction</SheetTitle>
        </SheetHeader>
        <SheetDescription>Add a new transaction to your dashboard.</SheetDescription>
        {isLoading ? (
          <div className="absolute inset-0 flex justify-center items-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={handleSubmit}
            disabled={createTransactionMutation.isPending || categoryMutation.isPending || accountMutation.isPending}
            accountOptions={accountOptions}
            categoryOptions={categoryOptions}
            onCreateAccount={onCreateAccount}
            onCreateCategory={onCreateCategory}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
