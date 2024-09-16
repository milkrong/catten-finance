import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";
import { convertAmountFromMillion } from "@/lib/utils";

export const useGetTransactions = () => {
  const from = useSearchParams().get("from") || "";
  const to = useSearchParams().get("to") || "";
  const accountId = useSearchParams().get("accountId") || "";

  const query = useQuery({
    queryKey: ["transactions", { from, to, accountId }],
    queryFn: async () => {
      const response = await client.api.transactions.$get({
        query: {
          from,
          to,
          accountId,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const { data } = await response.json();
      return data.map((transaction) => ({
        ...transaction,
        amount: convertAmountFromMillion(transaction.amount),
      }));
    },
  });

  return query;
};
