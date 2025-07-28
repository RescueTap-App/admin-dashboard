import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const formatCurrency = (amount: number, currency: 'NGN' | 'USD' = 'NGN') => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return formatter.format(amount);
}

export function formatNumber(value: number | string): string {
  const number = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(number)) return '0';

  const rounded = Math.round(number);

  return new Intl.NumberFormat('en-US').format(rounded);
}


export function disableConsoleLogsInProduction() {
  if (process.env.NODE_ENV === "production") {
    for (const method of ["log", "debug", "info", "warn"] as const) {
      console[method] = () => { };
    }
  }
}
