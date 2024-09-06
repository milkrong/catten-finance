import { type ClassValue, clsx } from "clsx";
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
