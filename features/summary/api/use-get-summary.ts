import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";
import { convertAmountFromMillion } from "@/lib/utils";

export const useGetSummary = () => {
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const accountId = params.get("accountId") || "";

  const query = useQuery({
    queryKey: ["summary", { from, to, accountId }],
    queryFn: async () => {
      const response = await client.api.summary.$get({
        query: {
          from,
          to,
          accountId,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch summary");
      }
      const { data } = await response.json();
      return {
        ...data,
        remainingAmount: convertAmountFromMillion(data.remainingAmount),
        incomingAmount: convertAmountFromMillion(data.incomingAmount),
        expensesAmount: convertAmountFromMillion(data.expensesAmount),
        categories: data.categories.map((category) => ({
          ...category,
          value: convertAmountFromMillion(category.value),
        })),
        days: data.days.map((day) => ({
          ...day,
          income: convertAmountFromMillion(day.income),
          expenses: convertAmountFromMillion(day.expenses),
        })),
      };
    },
  });

  return query;
};
