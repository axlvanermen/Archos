import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Plus, List, KanbanSquare, ListChecks, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import type { Task } from '@/types'
import { mockTasks, mockTaskProjects, getTaskProjectById, getAssigneeById } from './mockTaskData'
import { TaskStatusBadge, TaskPriorityBadge, kanbanStatuses, nextStatus } from './taskMeta'
import { NewTaskModal } from './NewTaskModal'

type ViewMode = 'lijst' | 'bord'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } }
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } }

function isOverdue(task: Task): boolean {
  if (!task.due_date || task.status === 'done' || task.status === 'cancelled') return false
  const due = new Date(task.due_date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return due < today
}

function isThisWeek(dateStr: string): boolean {
  const date = new Date(dateStr)
  const now = new Date()
  const start = new Date(now)
  start.setDate(now.getDate() - now.getDay())
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(start.getDate() + 7)
  return date >= start && date < end
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [search, setSearch] = useState('')
  const [projectFilter, setProjectFilter] = useState<string>('alle')
  const [viewMode, setViewMode] = useState<ViewMode>('lijst')
  const [showNewModal, setShowNewModal] = useState(false)

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase())
      const matchesProject = projectFilter === 'alle' || t.project_id === projectFilter
      return matchesSearch && matchesProject
    })
  }, [tasks, search, projectFilter])

  const stats = useMemo(() => {
    const open = tasks.filter((t) => t.status !== 'done' && t.status !== 'cancelled').length
    const overdue = tasks.filter(isOverdue).length
    const doneThisWeek = tasks.filter((t) => t.status === 'done' && t.completed_at && isThisWeek(t.completed_at)).length
    return { open, overdue, doneThisWeek }
  }, [tasks])

  const cycleStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: nextStatus(t.status), completed_at: nextStatus(t.status) === 'done' ? new Date().toISOString().slice(0, 10) : t.completed_at }
          : t,
      ),
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#0F172A]">Taken</h1>
          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-full">{filtered.length}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1">
            <button
              onClick={() => setViewMode('lijst')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
                viewMode === 'lijst' ? 'bg-[#0F172A] text-white' : 'text-slate-500 hover:text-slate-700',
              )}
            >
              <List size={14} /> Lijst
            </button>
            <button
              onClick={() => setViewMode('bord')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
                viewMode === 'bord' ? 'bg-[#0F172A] text-white' : 'text-slate-500 hover:text-slate-700',
              )}
            >
              <KanbanSquare size={14} /> Bord
            </button>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Plus size={16} /> Nieuwe taak
          </button>
        </div>
      </div>

      {/* Stats */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div variants={item} className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-blue-50 text-blue-600">
            <ListChecks size={20} />
          </div>
          <div className="text-2xl font-bold text-[#0F172A] leading-none">{stats.open}</div>
          <div className="text-xs font-medium text-slate-500 mt-1">Open taken</div>
        </motion.div>
        <motion.div variants={item} className="bg-white rounded-2xl border border-red-100 p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-red-50 text-red-600">
            <AlertTriangle size={20} />
          </div>
          <div className="text-2xl font-bold text-[#0F172A] leading-none">{stats.overdue}</div>
          <div className="text-xs font-medium text-slate-500 mt-1">Achterstallig</div>
        </motion.div>
        <motion.div variants={item} className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={20} />
          </div>
          <div className="text-2xl font-bold text-[#0F172A] leading-none">{stats.doneThisWeek}</div>
          <div className="text-xs font-medium text-slate-500 mt-1">Voltooid deze week</div>
        </motion.div>
      </motion.div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Zoek op titel…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C4943A] focus:border-transparent"
          />
        </div>
      </div>

      {/* Project pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setProjectFilter('alle')}
          className={cn(
            'flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer',
            projectFilter === 'alle' ? 'bg-[#0F172A] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300',
          )}
        >
          Alle
        </button>
        {mockTaskProjects.map((p) => (
          <button
            key={p.id}
            onClick={() => setProjectFilter(p.id)}
            className={cn(
              'flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer',
              projectFilter === p.id ? 'bg-[#0F172A] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300',
            )}
          >
            {p.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'lijst' ? (
          <motion.div
            key="lijst"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
          >
            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              <ul className="divide-y divide-slate-50">
                {filtered.map((task) => {
                  const project = getTaskProjectById(task.project_id)
                  const assignee = getAssigneeById(task.assignee_id)
                  const overdue = isOverdue(task)
                  return (
                    <li key={task.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                      <button
                        onClick={() => cycleStatus(task.id)}
                        title="Status wijzigen"
                        className={cn(
                          'flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-colors',
                          task.status === 'done'
                            ? 'bg-emerald-500 border-emerald-500'
                            : task.status === 'cancelled'
                              ? 'bg-slate-200 border-slate-300'
                              : 'border-slate-300 hover:border-[#C4943A]',
                        )}
                      >
                        {task.status === 'done' && <CheckCircle2 size={13} className="text-white" />}
                      </button>

                      <div className="min-w-0 flex-1">
                        <p className={cn('text-sm font-medium text-[#0F172A] truncate', task.status === 'cancelled' && 'line-through text-slate-400')}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {project && (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">{project.name}</span>
                          )}
                          {task.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full">{tag}</span>
                          ))}
                        </div>
                      </div>

                      <TaskStatusBadge status={task.status} className="hidden sm:flex flex-shrink-0" />
                      <TaskPriorityBadge priority={task.priority} className="hidden md:flex flex-shrink-0" />

                      <span className={cn('flex-shrink-0 text-xs w-20 text-right', overdue ? 'text-red-600 font-semibold' : 'text-slate-400')}>
                        {task.due_date ? formatDate(task.due_date) : '—'}
                      </span>

                      {assignee ? (
                        <span
                          title={assignee.name}
                          className={cn('flex-shrink-0 w-8 h-8 rounded-full text-white text-xs font-semibold flex items-center justify-center', assignee.color)}
                        >
                          {assignee.initials}
                        </span>
                      ) : (
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-400 text-xs font-semibold flex items-center justify-center">
                          —
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="bord"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
          >
            {kanbanStatuses.map((status) => {
              const columnTasks = filtered.filter((t) => t.status === status)
              return (
                <div key={status} className="bg-slate-50 rounded-2xl border border-slate-100 p-3 min-h-[120px]">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <TaskStatusBadge status={status} />
                    <span className="text-xs font-semibold text-slate-400">{columnTasks.length}</span>
                  </div>
                  <div className="space-y-2.5">
                    {columnTasks.map((task) => {
                      const project = getTaskProjectById(task.project_id)
                      const assignee = getAssigneeById(task.assignee_id)
                      const overdue = isOverdue(task)
                      return (
                        <div key={task.id} className="bg-white border border-slate-100 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-shadow">
                          <p className="text-sm font-medium text-[#0F172A] mb-2 leading-snug">{task.title}</p>
                          {project && (
                            <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full mb-2">{project.name}</span>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <TaskPriorityBadge priority={task.priority} />
                            {assignee && (
                              <span className={cn('w-6 h-6 rounded-full text-white text-[10px] font-semibold flex items-center justify-center', assignee.color)}>
                                {assignee.initials}
                              </span>
                            )}
                          </div>
                          {task.due_date && (
                            <p className={cn('text-xs mt-2', overdue ? 'text-red-600 font-semibold' : 'text-slate-400')}>
                              {formatDate(task.due_date)}
                            </p>
                          )}
                        </div>
                      )
                    })}
                    {columnTasks.length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-6">Geen taken</p>
                    )}
                  </div>
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <NewTaskModal isOpen={showNewModal} onClose={() => setShowNewModal(false)} />
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-16 text-slate-400">
      <p className="text-lg font-medium">Geen taken gevonden</p>
      <p className="text-sm mt-1">Pas uw zoekopdracht of filters aan</p>
    </div>
  )
}
