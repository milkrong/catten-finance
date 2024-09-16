import { type ClassValue, clsx } from "clsx";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertAmountToMillion(amount: number) {
  return Math.round(amount * 1000);
}

export function convertAmountFromMillion(amount: number) {
  return amount / 1000;
}

export function formatAmount(amount: number) {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export const calculatePercentageChange = (current: number, last: number) => {
  const $last = last ? last : 0;
  const $current = current ? current : 0;
  if ($last === 0) {
    return $current === $last ? 0 : 100;
  }

  return (($current - $last) / $last) * 100;
};

export const fillMissingDates = (
  activeDays: { date: Date; income: number; expenses: number }[],
  startDate: Date,
  endDate: Date
) => {
  if (activeDays.length === 0) {
    return [];
  }

  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  const transactionsByDay = allDays.map((day) => {
    const foundDay = activeDays.find((d) => isSameDay(d.date, day));
    if (foundDay) {
      return foundDay;
    }
    return {
      date: day,
      income: 0,
      expenses: 0,
    };
  });

  return transactionsByDay;
};

type Period = {
  from: string | Date | undefined;
  to: string | Date | undefined;
};

export function formatDateRange(period: Period) {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  if (!period.from) {
    return `${format(defaultFrom, "LLL dd")} - ${format(defaultTo, "LLL dd, y")}`;
  }

  if (period.to) {
    return `${format(period.from, "LLL dd")} - ${format(period.to, "LLL dd, y")}`;
  }

  return `${format(period.from, "LLL dd, y")}`;
}

export function formatCurrency(n: number): string {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n / 100);
}

export function formatPercentage(value: number, options: { addPrefix?: boolean } = { addPrefix: false }): string {
  const result = new Intl.NumberFormat("en-US", {
    style: "percent",
  }).format(value / 100);

  return options.addPrefix && value > 0 ? `+${result}` : result;
}
