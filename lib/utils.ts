import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency: string = 'DH'): string {
  // Map 'DH' to 'MAD' for Intl.NumberFormat compatibility
  const currencyCode = currency.toUpperCase() === 'DH' ? 'MAD' : currency;

  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'symbol'
  }).format(price);
}

export function generateQuoteNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  
  return `JG${year}${month}${day}${random}`
}

export function numberToWords(num: number): string {
  const ones = [
    '', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
    'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept',
    'dix-huit', 'dix-neuf'
  ]
  
  const tens = [
    '', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix',
    'quatre-vingt', 'quatre-vingt-dix'
  ]
  
  if (num === 0) return 'zéro'
  if (num < 20) return ones[num]
  if (num < 100) {
    const ten = Math.floor(num / 10)
    const one = num % 10
    return tens[ten] + (one ? '-' + ones[one] : '')
  }
  
  // Simplified for demo - would need full implementation for larger numbers
  return num.toString()
}
