import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  formatWithGlobalCurrency,
  formatCompactWithGlobalCurrency,
} from './currency';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  fromCurrency = 'USD',
  decimals = 0
): string {
  return formatWithGlobalCurrency(amount, {
    fromCurrency,
    decimals,
  });
}

export function formatCompactCurrency(
  amount: number,
  fromCurrency = 'USD'
): string {
  return formatCompactWithGlobalCurrency(amount, {
    fromCurrency,
  });
}
