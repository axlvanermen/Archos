import { cn } from '@/lib/utils'

// ─── SkeletonLine ────────────────────────────────────────────────────────────

interface SkeletonLineProps {
  width?: 'full' | '3/4' | '1/2' | '1/3' | '1/4'
  className?: string
}

export function SkeletonLine({ width = 'full', className }: SkeletonLineProps) {
  const widthMap: Record<string, string> = {
    full: 'w-full',
    '3/4': 'w-3/4',
    '1/2': 'w-1/2',
    '1/3': 'w-1/3',
    '1/4': 'w-1/4',
  }
  return (
    <div
      className={cn(
        'h-4 bg-slate-200 rounded animate-pulse',
        widthMap[width] ?? 'w-full',
        className,
      )}
    />
  )
}

// ─── SkeletonCard ────────────────────────────────────────────────────────────

interface SkeletonCardProps {
  className?: string
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-slate-200 p-5 space-y-4',
        className,
      )}
    >
      {/* Card header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-200 rounded-lg animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonLine width="3/4" />
          <SkeletonLine width="1/2" className="h-3" />
        </div>
      </div>
      {/* Card body lines */}
      <div className="space-y-2.5">
        <SkeletonLine width="full" />
        <SkeletonLine width="3/4" />
        <SkeletonLine width="1/2" />
      </div>
    </div>
  )
}

// ─── SkeletonTable ───────────────────────────────────────────────────────────

interface SkeletonTableProps {
  rows?: number
  columns?: number
  className?: string
}

export function SkeletonTable({ rows = 5, columns = 5, className }: SkeletonTableProps) {
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 overflow-hidden', className)}>
      {/* Table header */}
      <div className="flex items-center gap-4 px-5 py-3 border-b border-slate-200 bg-slate-50">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-3.5 bg-slate-300 rounded animate-pulse',
              i === 0 ? 'w-8 flex-shrink-0' : 'flex-1',
            )}
          />
        ))}
      </div>
      {/* Table rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="flex items-center gap-4 px-5 py-3.5 border-b border-slate-100 last:border-0"
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div
              key={colIdx}
              className={cn(
                'h-4 bg-slate-200 rounded animate-pulse',
                colIdx === 0
                  ? 'w-8 flex-shrink-0'
                  : colIdx === columns - 1
                    ? 'w-20 flex-shrink-0'
                    : 'flex-1',
              )}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// ─── SkeletonStat ────────────────────────────────────────────────────────────

export function SkeletonStat({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 p-5', className)}>
      <div className="flex items-center justify-between mb-4">
        <SkeletonLine width="1/2" className="h-3.5" />
        <div className="w-9 h-9 bg-slate-200 rounded-lg animate-pulse" />
      </div>
      <SkeletonLine width="1/3" className="h-8 mb-2" />
      <SkeletonLine width="1/2" className="h-3" />
    </div>
  )
}
