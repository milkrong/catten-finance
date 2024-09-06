"use client";

import { EditAccountSheet } from "@/features/accounts/components/EditAccountSheet";
import { NewAccountSheet } from "@/features/accounts/components/NewAccountSheet";
import { NewCategorySheet } from "@/features/categories/components/NewCategorySheet";
import { EditCategorySheet } from "@/features/categories/components/EditCategorySheet";
import { useMountedState } from "react-use";
import { NewTransactionSheet } from "@/features/transactions/components/NewTransactionSheet";
import { EditTransactionSheet } from "@/features/transactions/components/EditTransactionSheet";

export const SheetProvider = () => {
  const isMounted = useMountedState();
  if (!isMounted) return null;

  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
      <NewCategorySheet />
      <EditCategorySheet />
      <NewTransactionSheet />
      <EditTransactionSheet />
    </>
  );
};
