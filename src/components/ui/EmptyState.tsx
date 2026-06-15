import React from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-6',
        className,
      )}
    >
      {/* Icon circle */}
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-5 text-slate-400">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-slate-800 mb-1.5">{title}</h3>

      {/* Description */}
      <p className="text-sm text-slate-500 max-w-xs leading-relaxed">{description}</p>

      {/* Optional action button */}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:opacity-90 active:scale-95 cursor-pointer"
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
