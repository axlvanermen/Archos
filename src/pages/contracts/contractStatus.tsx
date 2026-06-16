import { cn } from '@/lib/utils'

export type ContractStatus = 'draft' | 'sent' | 'signed' | 'active' | 'completed' | 'cancelled'

// Contract statuses don't fit the existing project-oriented StatusBadge config
// (see src/components/ui/StatusBadge.tsx), so we keep a small local badge here
// rather than overloading that shared component with unrelated status values.
const contractStatusConfig: Record<ContractStatus, { label: string; className: string; dot: string }> = {
  draft: { label: 'Concept', className: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
  sent: { label: 'Verstuurd', className: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' },
  signed: { label: 'Ondertekend', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  active: { label: 'Actief', className: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  completed: { label: 'Afgerond', className: 'bg-teal-50 text-teal-700 border-teal-200', dot: 'bg-teal-500' },
  cancelled: { label: 'Geannuleerd', className: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
}

export function ContractStatusBadge({ status, className }: { status: ContractStatus; className?: string }) {
  const config = contractStatusConfig[status] ?? contractStatusConfig.draft
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

export const contractStatusFilters: { label: string; value: ContractStatus | 'alle' }[] = [
  { label: 'Alle', value: 'alle' },
  { label: 'Concept', value: 'draft' },
  { label: 'Verstuurd', value: 'sent' },
  { label: 'Ondertekend', value: 'signed' },
  { label: 'Actief', value: 'active' },
  { label: 'Afgerond', value: 'completed' },
  { label: 'Geannuleerd', value: 'cancelled' },
]
