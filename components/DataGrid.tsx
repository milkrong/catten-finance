"use client";

import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { formatDateRange } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { FaPiggyBank } from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { DataCard, DataCardSkeleton } from "./DataCard";

export const DataGrid = () => {
  const params = useSearchParams();
  const from = params.get("from") || undefined;
  const to = params.get("to") || undefined;

  const { data, isLoading } = useGetSummary();

  const dateRangeLabel = formatDateRange({ from, to });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
      {isLoading ? (
        <DataCardSkeleton />
      ) : (
        <DataCard
          title="Remaining"
          value={data?.remainingAmount}
          percentageChange={data?.remainingChange}
          icon={FaPiggyBank}
          variant="default"
          dateRange={dateRangeLabel}
        />
      )}
      {isLoading ? (
        <DataCardSkeleton />
      ) : (
        <DataCard
          title="Income"
          value={data?.incomingAmount}
          percentageChange={data?.incomingChange}
          icon={FaArrowTrendUp}
          variant="default"
          dateRange={dateRangeLabel}
        />
      )}
      {isLoading ? (
        <DataCardSkeleton />
      ) : (
        <DataCard
          title="Expenses"
          value={data?.expensesAmount}
          percentageChange={data?.expensesChange}
          icon={FaArrowTrendDown}
          variant="default"
          dateRange={dateRangeLabel}
        />
      )}
    </div>
  );
};
