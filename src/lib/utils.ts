import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('nl-BE', { style: 'currency', currency: 'EUR' }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('nl-BE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date))
}

export function getGreeting(name: string): string {
  const hour = new Date().getHours()
  if (hour < 12) return `Goedemorgen, ${name}`
  if (hour < 18) return `Goedemiddag, ${name}`
  return `Goedenavond, ${name}`
}
