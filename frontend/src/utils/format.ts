const priceFormat = new Intl.NumberFormat('hr-HR', { style: 'currency', currency: 'EUR' })

// API amounts are decimal strings ("150.00" → "150,00 €").
export function formatPrice(amount: string): string {
  return priceFormat.format(Number(amount))
}
