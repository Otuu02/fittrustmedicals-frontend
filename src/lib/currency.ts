// src/lib/currency.ts

/**
 * Format price with currency symbol
 */
export function formatPrice(price: number, currency: string = 'NGN'): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
  }).format(price);
}

/**
 * Convert price to Naira (if different currency)
 */
export function convertToNaira(price: number, exchangeRate: number = 1): number {
  return price * exchangeRate;
}

/**
 * Parse price from string/number
 */
export function parsePrice(value: string | number): number {
  if (typeof value === 'number') return value;
  return parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0;
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-NG').format(num);
}