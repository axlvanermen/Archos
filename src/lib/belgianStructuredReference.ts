/**
 * Belgian structured payment communication ("gestructureerde mededeling" / OGM-VCS).
 *
 * Format: +++XXX/XXXX/XXXXX+++ (10 digits + 2 check digits = 12 digits total).
 *
 * Algorithm (official Belgian National Bank standard):
 * 1. Take the first 10 digits as a single number.
 * 2. Compute that number mod 97.
 * 3. If the remainder is 0, the check digits are 97.
 *    Otherwise, the check digits are the remainder, zero-padded to 2 digits.
 */

/**
 * Generates a valid 12-digit Belgian structured reference from a numeric seed,
 * formatted as +++XXX/XXXX/XXXXX+++.
 */
export function generateStructuredReference(seed: number): string {
  // Normalise the seed into a positive 10-digit base number.
  const base = Math.abs(Math.trunc(seed)) % 10_000_000_000
  const first10 = base.toString().padStart(10, '0')

  const firstTenAsNumber = Number(first10)
  const remainder = firstTenAsNumber % 97
  const checkDigits = remainder === 0 ? 97 : remainder
  const checkDigitsStr = checkDigits.toString().padStart(2, '0')

  const raw = `${first10}${checkDigitsStr}`
  return formatStructuredReference(raw)
}

/**
 * Formats a raw 12-digit string into the standard Belgian display format:
 * +++XXX/XXXX/XXXXX+++
 */
export function formatStructuredReference(raw: string): string {
  const digits = raw.replace(/\D/g, '').padStart(12, '0').slice(0, 12)
  const part1 = digits.slice(0, 3)
  const part2 = digits.slice(3, 7)
  const part3 = digits.slice(7, 12)
  return `+++${part1}/${part2}/${part3}+++`
}
