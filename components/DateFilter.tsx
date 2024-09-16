"use client";
import { DateRange } from "react-day-picker";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { format, subDays } from "date-fns";
import { formatDateRange } from "@/lib/utils";
import { useState } from "react";
import qs from "query-string";
import { ChevronDown } from "lucide-react";
import { Calendar } from "./ui/calendar";

export const DateFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const accountId = searchParams.get("accountId");

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 100);

  const paramsState = {
    from: from ? new Date(from) : defaultFrom,
    to: to ? new Date(to) : defaultTo,
  };

  const [dateRange, setDateRange] = useState<DateRange | undefined>(paramsState);

  const pushParams = (dateRange: DateRange | undefined) => {
    const query = {
      from: format(dateRange?.from || defaultFrom, "yyyy-MM-dd"),
      to: format(dateRange?.to || defaultTo, "yyyy-MM-dd"),
      accountId,
    };
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };

  const onReset = () => {
    setDateRange(undefined);
    pushParams(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={false}
          size="sm"
          variant="outline"
          className="lg:w-auto w-full h-9 rounded-md px-3 \
      font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none \
      focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition"
        >
          <span>{formatDateRange(paramsState)}</span>
          <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 lg:w-auto" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={setDateRange}
          numberOfMonths={2}
        />
        <div className="flex w-full p-4 items-center gap-x-2">
          <PopoverClose asChild>
            <Button
              className="w-full"
              variant="outline"
              onClick={onReset}
              disabled={!dateRange?.from || !dateRange?.to}
            >
              Reset
            </Button>
          </PopoverClose>
          <PopoverClose asChild>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => pushParams(dateRange)}
              disabled={!dateRange?.from || !dateRange?.to}
            >
              Apply
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};
