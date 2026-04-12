// Fittrustmedicals formatting utilities
export const EXCHANGE_RATE = 1500 // NGN per USD

export const formatters = {
  // Currency formatting
  currency: (amount: number, currency: string = 'NGN'): string => {
    if (currency === 'NGN') {
      return `₦${Math.round(amount).toLocaleString('en-NG')}`
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  },

  // Number formatting
  number: (num: number): string => {
    return Math.round(num).toLocaleString('en-NG')
  },

  // USD to Naira conversion
  usdToNaira: (usdAmount: number): number => {
    return Math.round(usdAmount * EXCHANGE_RATE)
  },

  // Naira to USD conversion
  nairaToUsd: (nairaAmount: number): string => {
    return (nairaAmount / EXCHANGE_RATE).toFixed(2)
  },

  // Medical category formatting
  medicalCategory: (category: string): string => {
    const categories: { [key: string]: string } = {
      'diagnostics': '🔬 Diagnostics',
      'monitoring': '📊 Monitoring',
      'emergency': '🚨 Emergency',
      'mobility': '♿ Mobility',
      'respiratory': '🫁 Respiratory',
      'surgical': '🔪 Surgical',
      'protective': '🛡️ Protective',
      'pharmacy': '💊 Pharmacy'
    }
    return categories[category.toLowerCase()] || `📦 ${category}`
  },

  // Stock status with colors and icons
  stockStatus: (stock: number) => {
    if (stock === 0) {
      return { text: 'Out of Stock', color: 'text-red-600', icon: '❌' }
    } else if (stock <= 5) {
      return { text: 'Low Stock', color: 'text-orange-600', icon: '⚠️' }
    } else if (stock <= 20) {
      return { text: 'In Stock', color: 'text-yellow-600', icon: '📦' }
    } else {
      return { text: 'Well Stocked', color: 'text-green-600', icon: '✅' }
    }
  },

  // Date formatting
  date: (date: Date): string => {
    return new Intl.DateTimeFormat('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }
}

// Backward compatibility with old formatPrice function
export const formatPrice = (price: number, showCurrency: boolean = true): string => {
  const nairaPrice = typeof price === 'number' ? formatters.usdToNaira(price) : 0
  return showCurrency ? formatters.currency(nairaPrice) : formatters.number(nairaPrice)
}