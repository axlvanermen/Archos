export type ComplianceLevel = 'ok' | 'warning' | 'critical' | 'unknown'

export interface ComplianceStatus {
  level: ComplianceLevel
  label: string
  daysRemaining: number | null
}

/**
 * Determines the compliance status of a single expiry date (e.g. VCA,
 * RSZ-attest, verzekering) relative to today.
 *
 * - unknown: no date registered
 * - critical: already expired, or expires within 30 days
 * - warning: expires within 31-90 days
 * - ok: expires in more than 90 days
 */
export function getComplianceStatus(expiryDate: string | null): ComplianceStatus {
  if (!expiryDate) {
    return { level: 'unknown', label: 'Niet geregistreerd', daysRemaining: null }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)

  const daysRemaining = Math.round((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (daysRemaining < 0) {
    return { level: 'critical', label: 'Verlopen', daysRemaining }
  }
  if (daysRemaining <= 30) {
    return { level: 'critical', label: 'Verloopt binnenkort', daysRemaining }
  }
  if (daysRemaining <= 90) {
    return { level: 'warning', label: 'Binnenkort verlopen', daysRemaining }
  }
  return { level: 'ok', label: 'In orde', daysRemaining }
}

/**
 * Combines the VCA and RSZ-attest expiry dates into a single overall
 * compliance status for use on list cards. Insurance is informational and
 * shown separately on the detail page but does not drive the card badge.
 */
export function getOverallComplianceStatus(
  vcaExpiryDate: string | null,
  rszExpiryDate: string | null,
): ComplianceStatus {
  if (!vcaExpiryDate || !rszExpiryDate) {
    return { level: 'unknown', label: 'Niet geregistreerd', daysRemaining: null }
  }

  const vca = getComplianceStatus(vcaExpiryDate)
  const rsz = getComplianceStatus(rszExpiryDate)

  const levelRank: Record<ComplianceLevel, number> = { critical: 0, warning: 1, ok: 2, unknown: 3 }
  const worst = levelRank[vca.level] <= levelRank[rsz.level] ? vca : rsz

  return worst
}
