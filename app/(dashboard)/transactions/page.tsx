"use client";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete";
import { useNewTransactionStore } from "@/features/transactions/hooks/use-new-transaction";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useState } from "react";
import { UploadButton } from "./upload-button";
import { ImportCard } from "./import-card";
import { transactions as transactionsSchema } from "@/db/schema";
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";
import { toast } from "sonner";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create";

enum VARIANTS {
  LIST = "list",
  IMPORT = "import",
}

const DEFAULT_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};

export default function TransactionsPage() {
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState<typeof DEFAULT_IMPORT_RESULTS>(DEFAULT_IMPORT_RESULTS);
  const [AccountDialog, confirm] = useSelectAccount();
  const onUpload = (results: typeof DEFAULT_IMPORT_RESULTS) => {
    setVariant(VARIANTS.IMPORT);
    setImportResults(results);
  };

  const onCancel = () => {
    setVariant(VARIANTS.LIST);
    setImportResults(DEFAULT_IMPORT_RESULTS);
  };

  const newTransaction = useNewTransactionStore();
  const bulkCreate = useBulkCreateTransactions();
  const transactionQuery = useGetTransactions();
  const bulkDelete = useBulkDeleteTransactions();
  const transactions = transactionQuery.data || [];

  const onSubmitImport = async (values: (typeof transactionsSchema.$inferInsert)[]) => {
    const accountId = await confirm();
    if (!accountId) {
      toast.error("Please select an account to continue");
      return;
    }

    const data = values.map((value) => ({
      ...value,
      accountId,
    }));

    bulkCreate.mutate(data, {
      onSuccess: () => {
        toast.success("Transactions imported successfully");
        onCancel();
      },
    });
  };

  const isDisabled = transactionQuery.isLoading || bulkDelete.isPending;
  if (transactionQuery.isLoading) {
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

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard data={importResults.data} onCancel={onCancel} onSubmit={onSubmitImport} />
      </>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-19 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-lg line-clamp-1">Transactions</CardTitle>
          <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
            <Button size="sm" className="w-full lg:w-auto" onClick={newTransaction.onOpen}>
              <Plus className="size-4 mr-2" />
              Add Transaction
            </Button>
            <UploadButton onUpload={onUpload} />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="payee"
            data={transactions}
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
