import { cn } from '@/lib/utils'

export type Status =
  | 'aanvraag'
  | 'offerte_opmaak'
  | 'offerte_verstuurd'
  | 'gewonnen'
  | 'in_uitvoering'
  | 'oplevering'
  | 'gefactureerd'
  | 'afgerond'
  | 'verloren'

const statusConfig: Record<Status, { label: string; className: string; dot: string }> = {
  aanvraag: {
    label: 'Aanvraag',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  offerte_opmaak: {
    label: 'Offerte in opmaak',
    className: 'bg-purple-50 text-purple-700 border-purple-200',
    dot: 'bg-purple-500',
  },
  offerte_verstuurd: {
    label: 'Offerte verstuurd',
    className: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dot: 'bg-indigo-500',
  },
  gewonnen: {
    label: 'Opdracht',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  in_uitvoering: {
    label: 'In uitvoering',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  oplevering: {
    label: 'Oplevering',
    className: 'bg-orange-50 text-orange-700 border-orange-200',
    dot: 'bg-orange-500',
  },
  gefactureerd: {
    label: 'Gefactureerd',
    className: 'bg-teal-50 text-teal-700 border-teal-200',
    dot: 'bg-teal-500',
  },
  afgerond: {
    label: 'Afgerond',
    className: 'bg-gray-50 text-gray-600 border-gray-200',
    dot: 'bg-gray-400',
  },
  verloren: {
    label: 'Verloren',
    className: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-500',
  },
}

interface StatusBadgeProps {
  status: Status
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.aanvraag
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

export { statusConfig }
