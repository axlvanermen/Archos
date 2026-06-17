import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronRight, AlertTriangle, CalendarDays } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { usePlanningProjects, type PlanningProject, type ProjectPhase } from '@/hooks/useProjectPhases'
import { SkeletonCard } from '@/components/ui/LoadingSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'

type PhaseStatus = ProjectPhase['status']

const TODAY = new Date()

const statusStyles: Record<PhaseStatus, { bar: string; fill: string; label: string; text: string }> = {
  gepland: { bar: 'bg-slate-300', fill: 'bg-slate-400', label: 'Gepland', text: 'text-slate-600' },
  lopend: { bar: 'bg-blue-400', fill: 'bg-blue-600', label: 'Lopend', text: 'text-blue-700' },
  voltooid: { bar: 'bg-emerald-400', fill: 'bg-emerald-600', label: 'Voltooid', text: 'text-emerald-700' },
  vertraagd: { bar: 'bg-red-300', fill: 'bg-red-500', label: 'Vertraagd', text: 'text-red-700' },
}

function daysBetween(a: Date, b: Date): number {
  return (b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)
}

function getRange(projects: PlanningProject[]): { start: Date; end: Date } {
  const starts = projects.map((p) => new Date(p.start_date).getTime())
  const ends = projects.map((p) => new Date(p.end_date).getTime())
  return { start: new Date(Math.min(...starts)), end: new Date(Math.max(...ends)) }
}

function getMonthLabels(start: Date, end: Date): { label: string; left: number }[] {
  const months: { label: string; left: number }[] = []
  const totalDays = daysBetween(start, end)
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1)
  while (cursor <= end) {
    const left = Math.max(0, (daysBetween(start, cursor) / totalDays) * 100)
    months.push({
      label: cursor.toLocaleDateString('nl-BE', { month: 'short', year: 'numeric' }),
      left,
    })
    cursor.setMonth(cursor.getMonth() + 1)
  }
  return months
}

const LABEL_COL_WIDTH = 224 // px, fixed so month-header / today-marker math lines up exactly with phase tracks

function PhaseRow({ phase, rangeStart, totalDays }: { phase: ProjectPhase; rangeStart: Date; totalDays: number }) {
  const start = new Date(phase.start_date)
  const end = new Date(phase.end_date)
  const left = (daysBetween(rangeStart, start) / totalDays) * 100
  const width = Math.max((daysBetween(start, end) / totalDays) * 100, 0.5)
  const styles = statusStyles[phase.status]

  return (
    <div className="flex items-center gap-4 py-2.5">
      <div style={{ width: LABEL_COL_WIDTH }} className="flex-shrink-0 pr-2">
        <p className="text-sm text-slate-700 leading-snug truncate" title={phase.name}>{phase.name}</p>
        <p className="text-xs text-slate-400 mt-0.5">{formatDate(phase.start_date)} → {formatDate(phase.end_date)}</p>
      </div>
      <div className="relative flex-1 h-7 min-w-[480px]">
        <div className="absolute inset-y-0 left-0 right-0 rounded-md bg-slate-50" />
        <motion.div
          initial={{ opacity: 0, scaleX: 0.8 }}
          animate={
            phase.status === 'lopend'
              ? { opacity: [0.85, 1, 0.85], scaleX: 1 }
              : { opacity: 1, scaleX: 1 }
          }
          transition={
            phase.status === 'lopend'
              ? { opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' }, scaleX: { duration: 0.3 } }
              : { duration: 0.3 }
          }
          className={cn('absolute inset-y-0 rounded-md overflow-hidden flex items-center', styles.bar)}
          style={{ left: `${left}%`, width: `${width}%` }}
        >
          <div className={cn('h-full', styles.fill)} style={{ width: `${phase.progress}%` }} />
          {phase.status === 'vertraagd' && (
            <AlertTriangle size={12} className="absolute right-1.5 text-red-700" />
          )}
        </motion.div>
      </div>
    </div>
  )
}

function ProjectGanttSection({
  project,
  rangeStart,
  totalDays,
  collapsible,
}: {
  project: PlanningProject
  rangeStart: Date
  totalDays: number
  collapsible: boolean
}) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      {collapsible && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center gap-2 w-full text-left px-1 py-3 cursor-pointer hover:bg-slate-50 rounded-lg transition-colors"
        >
          {expanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
          <span className="font-semibold text-[#0F172A] text-sm">{project.name}</span>
          <span className="text-xs text-slate-400">{formatDate(project.start_date)} → {formatDate(project.end_date)}</span>
        </button>
      )}
      {expanded && (
        <div className="pb-2">
          {project.phases.map((phase) => (
            <PhaseRow key={phase.id} phase={phase} rangeStart={rangeStart} totalDays={totalDays} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function PlanningPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | 'alle'>('alle')
  const { data: allProjects, isLoading, error } = usePlanningProjects()

  const projects = allProjects ?? []

  const visibleProjects = useMemo(
    () => (selectedProjectId === 'alle' ? projects : projects.filter((p) => p.id === selectedProjectId)),
    [projects, selectedProjectId],
  )

  const { start: rangeStart, end: rangeEnd } = useMemo(
    () => visibleProjects.length > 0 ? getRange(visibleProjects) : { start: new Date(), end: new Date() },
    [visibleProjects],
  )
  const totalDays = Math.max(daysBetween(rangeStart, rangeEnd), 1)
  const monthLabels = useMemo(() => getMonthLabels(rangeStart, rangeEnd), [rangeStart, rangeEnd])

  const showTodayMarker = TODAY >= rangeStart && TODAY <= rangeEnd
  const todayLeft = (daysBetween(rangeStart, TODAY) / totalDays) * 100

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#0F172A]">Planning</h1>
          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-full">
            {visibleProjects.reduce((sum, p) => sum + p.phases.length, 0)} fases
          </span>
        </div>
      </div>

      {/* Project selector pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedProjectId('alle')}
          className={cn(
            'flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer',
            selectedProjectId === 'alle'
              ? 'bg-[#0F172A] text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300',
          )}
        >
          Alle projecten
        </button>
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedProjectId(p.id)}
            className={cn(
              'flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer',
              selectedProjectId === p.id
                ? 'bg-[#0F172A] text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300',
            )}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-5 text-xs text-slate-500">
        {Object.entries(statusStyles).map(([key, s]) => (
          <span key={key} className="flex items-center gap-1.5">
            <span className={cn('w-2.5 h-2.5 rounded-full', s.fill)} />
            {s.label}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="w-0.5 h-3 bg-[#C4943A]" />
          Vandaag
        </span>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="text-center py-16 text-red-500">
          <p className="text-sm font-medium">Er ging iets mis bij het laden van de planning.</p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && projects.length === 0 && (
        <EmptyState
          icon={<CalendarDays size={28} />}
          title="Geen planningsfases"
          description="Voeg fases toe aan uw projecten om de Gantt-planning te zien."
        />
      )}

      {/* Gantt chart */}
      {!isLoading && !error && visibleProjects.length > 0 && (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6">
        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            {/* Month header */}
            <div className="flex items-center gap-4 mb-2">
              <div style={{ width: LABEL_COL_WIDTH }} className="flex-shrink-0" />
              <div className="relative flex-1 h-5 min-w-[480px]">
                {monthLabels.map((m, idx) => (
                  <span
                    key={idx}
                    className="absolute top-0 text-xs font-medium text-slate-400"
                    style={{ left: `${m.left}%` }}
                  >
                    {m.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Chart body with today marker */}
            <div className="relative">
              {showTodayMarker && (
                <div
                  className="absolute top-0 bottom-0 right-0 z-10 pointer-events-none"
                  style={{ left: LABEL_COL_WIDTH + 16, minWidth: 480 }}
                >
                  <div className="relative h-full w-full">
                    <div className="absolute top-0 bottom-0 w-px bg-[#C4943A]" style={{ left: `${todayLeft}%` }}>
                      <div className="w-2 h-2 rounded-full bg-[#C4943A] -translate-x-1/2" />
                    </div>
                  </div>
                </div>
              )}

              {visibleProjects.map((project) => (
                <ProjectGanttSection
                  key={project.id}
                  project={project}
                  rangeStart={rangeStart}
                  totalDays={totalDays}
                  collapsible={selectedProjectId === 'alle'}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      )}
    </div>
  )
}
