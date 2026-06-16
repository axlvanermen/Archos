import { cn } from '@/lib/utils'

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'credit_note'

// Invoice statuses don't fit the existing project-oriented StatusBadge config
// (see src/components/ui/StatusBadge.tsx), so we keep a small local badge here,
// mirroring the pattern used for contracts in contractStatus.tsx.
const invoiceStatusConfig: Record<InvoiceStatus, { label: string; className: string; dot: string }> = {
  draft: { label: 'Concept', className: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
  sent: { label: 'Verstuurd', className: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  paid: { label: 'Betaald', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  overdue: { label: 'Achterstallig', className: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
  cancelled: { label: 'Geannuleerd', className: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
  credit_note: { label: 'Creditnota', className: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
}

export function InvoiceStatusBadge({ status, className }: { status: InvoiceStatus; className?: string }) {
  const config = invoiceStatusConfig[status] ?? invoiceStatusConfig.draft
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        config.className,
        className,
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', config.dot)} />
      {config.label}
    </span>
  )
}

export const invoiceStatusFilters: { label: string; value: InvoiceStatus | 'alle' }[] = [
  { label: 'Alle', value: 'alle' },
  { label: 'Concept', value: 'draft' },
  { label: 'Verstuurd', value: 'sent' },
  { label: 'Betaald', value: 'paid' },
  { label: 'Achterstallig', value: 'overdue' },
  { label: 'Geannuleerd', value: 'cancelled' },
  { label: 'Creditnota', value: 'credit_note' },
]
