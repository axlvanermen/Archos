import { Flame } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'

export type TaskStatus = Task['status']
export type TaskPriority = Task['priority']

// Task statuses/priorities don't fit the existing project-oriented StatusBadge config
// (see src/components/ui/StatusBadge.tsx), so we keep small local badges here
// rather than overloading that shared component with unrelated status values.
const taskStatusConfig: Record<TaskStatus, { label: string; className: string; dot: string }> = {
  todo: { label: 'Te doen', className: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
  in_progress: { label: 'In uitvoering', className: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  review: { label: 'Nazicht', className: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  done: { label: 'Voltooid', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  cancelled: { label: 'Geannuleerd', className: 'bg-slate-50 text-slate-400 border-slate-200 line-through', dot: 'bg-slate-400' },
}

export function TaskStatusBadge({ status, className }: { status: TaskStatus; className?: string }) {
  const config = taskStatusConfig[status] ?? taskStatusConfig.todo
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

export const taskStatusFilters: { label: string; value: TaskStatus | 'alle' }[] = [
  { label: 'Alle', value: 'alle' },
  { label: 'Te doen', value: 'todo' },
  { label: 'In uitvoering', value: 'in_progress' },
  { label: 'Nazicht', value: 'review' },
  { label: 'Voltooid', value: 'done' },
  { label: 'Geannuleerd', value: 'cancelled' },
]

// Statuses shown as kanban columns (cancelled is intentionally omitted from the board)
export const kanbanStatuses: TaskStatus[] = ['todo', 'in_progress', 'review', 'done']

const taskPriorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  low: { label: 'Laag', className: 'bg-gray-50 text-gray-600 border-gray-200' },
  medium: { label: 'Gemiddeld', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  high: { label: 'Hoog', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  urgent: { label: 'Urgent', className: 'bg-red-50 text-red-700 border-red-200' },
}

export function TaskPriorityBadge({ priority, className }: { priority: TaskPriority; className?: string }) {
  const config = taskPriorityConfig[priority] ?? taskPriorityConfig.medium
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border',
        config.className,
        className,
      )}
    >
      {priority === 'urgent' && <Flame size={11} className="flex-shrink-0" />}
      {config.label}
    </span>
  )
}

export const taskPriorityFilters: { label: string; value: TaskPriority | 'alle' }[] = [
  { label: 'Alle', value: 'alle' },
  { label: 'Laag', value: 'low' },
  { label: 'Gemiddeld', value: 'medium' },
  { label: 'Hoog', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
]

// Cycles a task through the simplified manual workflow used by the list view's
// status toggle: todo -> in_progress -> done -> todo
export function nextStatus(status: TaskStatus): TaskStatus {
  if (status === 'todo') return 'in_progress'
  if (status === 'in_progress') return 'done'
  if (status === 'review') return 'done'
  return 'todo'
}
