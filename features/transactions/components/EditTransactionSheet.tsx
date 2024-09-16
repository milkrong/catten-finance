import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useEditTransactionStore } from "@/features/transactions/hooks/use-edit-transaction";
import { TransactionForm, ApiFormValues } from "./TransactionForm";
import { useEditTransaction } from "@/features/transactions/api/use-edit-transaction";
import { useGetTransaction } from "@/features/transactions/api/use-get-transaction";
import { Loader2 } from "lucide-react";
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";
import { useConfirm } from "@/hooks/use-confirm";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";

export const EditTransactionSheet = () => {
  const { id, isOpen, onClose } = useEditTransactionStore();
  const transactionQuery = useGetTransaction(id);
  const mutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);
  const [DeleteConfirmation, deleteConfirm] = useConfirm(
    "Are you sure you want to delete this transaction?",
    "This action cannot be undone."
  );

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

  const handleSubmit = (values: ApiFormValues) => {
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
  const defaultValues = transactionQuery.data
    ? {
        date: transactionQuery.data.date ? new Date(transactionQuery.data.date) : new Date(),
        amount: transactionQuery.data.amount.toString(),
        payee: transactionQuery.data.payee,
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId ?? undefined,
        notes: transactionQuery.data.notes,
      }
    : { date: new Date(), amount: "", payee: "", accountId: "", notes: "" };

  const isPending =
    mutation.isPending ||
    deleteMutation.isPending ||
    transactionQuery.isLoading ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  const isLoading = transactionQuery.isLoading || categoryQuery.isLoading || accountQuery.isLoading;

  return (
    <>
      <DeleteConfirmation />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit transaction</SheetTitle>
          </SheetHeader>
          <SheetDescription>Edit transaction details.</SheetDescription>
          {isLoading ? (
            <div className="absolute inset-0 flex justify-center items-center h-full">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <TransactionForm
              key={id}
              id={id}
              onSubmit={handleSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={handleDelete}
              accountOptions={accountOptions}
              categoryOptions={categoryOptions}
              onCreateAccount={onCreateAccount}
              onCreateCategory={onCreateCategory}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
