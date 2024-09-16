'use client';

import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNewAccountStore } from '@/features/accounts/hooks/use-new-accounts';
import { Loader2, Plus } from 'lucide-react';
import { columns } from './columns';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { Skeleton } from '@/components/ui/skeleton';
import { useBulkDeleteAccounts } from '@/features/accounts/api/use-bulk-delete';

export default function AccountsPage() {
  const newAccount = useNewAccountStore();
  const accountQuery = useGetAccounts();
  const bulkDelete = useBulkDeleteAccounts();
  const accounts = accountQuery.data || [];
  const isDisabled = accountQuery.isLoading || bulkDelete.isPending;
  if (accountQuery.isLoading) {
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
          <CardTitle className="text-lg line-clamp-1">Accounts</CardTitle>
          <Button size="sm" onClick={newAccount.onOpen}>
            <Plus className="size-4 mr-2" />
            Add Account
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="name"
            data={accounts}
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
