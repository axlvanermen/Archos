import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, SlidersHorizontal, FolderKanban } from 'lucide-react'
import { motion } from 'framer-motion'
import { StatusBadge, type Status } from '@/components/ui/StatusBadge'
import { SkeletonCard } from '@/components/ui/LoadingSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { NewProjectModal } from './NewProjectModal'
import { formatCurrency, formatDate, getInitials } from '@/lib/utils'
import { useProjects } from '@/hooks/useProjects'

const statusFilters: { label: string; value: Status | 'alle' }[] = [
  { label: 'Alle', value: 'alle' },
  { label: 'Aanvraag', value: 'aanvraag' },
  { label: 'Offerte', value: 'offerte_verstuurd' },
  { label: 'Opdracht', value: 'gewonnen' },
  { label: 'In uitvoering', value: 'in_uitvoering' },
  { label: 'Oplevering', value: 'oplevering' },
  { label: 'Afgerond', value: 'afgerond' },
]

const managerColors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500']

function managerColorFor(id: string | null | undefined): string {
  if (!id) return 'bg-slate-400'
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  return managerColors[hash % managerColors.length]
}

export default function ProjectsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<Status | 'alle'>('alle')
  const [showNewModal, setShowNewModal] = useState(false)

  const { data: projects, isLoading, error } = useProjects()

  const filtered = (projects ?? []).filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.client?.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (p.reference ?? '').toLowerCase().includes(search.toLowerCase())
    const matchesStatus = activeFilter === 'alle' || p.status === activeFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#0F172A]">Projecten</h1>
          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-full">{filtered.length}</span>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Plus size={16} /> Nieuw project
        </button>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Zoek op naam, klant of nummer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C4943A] focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer sm:w-auto">
          <SlidersHorizontal size={15} /> Filter
        </button>
      </div>

      {/* Status pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              activeFilter === f.value
                ? 'bg-[#0F172A] text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="text-center py-6 text-red-500 text-sm font-medium">
          Er ging iets mis bij het laden van de projecten.
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Grid */}
      {!isLoading && !error && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        >
          {filtered.map((project) => {
            const budget = project.budget ?? 0
            const invoiced = project.total_invoiced ?? 0
            const managerName = project.manager?.full_name
            return (
              <motion.div
                key={project.id}
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
                onClick={() => navigate(`/projecten/${project.id}`)}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#0F172A] truncate group-hover:text-[#C4943A] transition-colors">{project.name}</h3>
                    {project.reference && <p className="text-xs text-slate-400 font-mono mt-0.5">{project.reference}</p>}
                  </div>
                  <StatusBadge status={project.status} />
                </div>

                <p className="text-sm text-slate-600 mb-3 truncate">{project.client?.name ?? '—'}</p>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
                  <span>{project.start_date ? formatDate(project.start_date) : '—'}</span>
                  <span>→</span>
                  <span>{project.end_date ? formatDate(project.end_date) : '—'}</span>
                </div>

                {/* Budget progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500">Budget</span>
                    <span className="font-semibold text-[#0F172A]">{formatCurrency(budget)}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C4943A] rounded-full transition-all"
                      style={{ width: `${budget > 0 ? Math.min((invoiced / budget) * 100, 100) : 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{formatCurrency(invoiced)} gefactureerd</p>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-50">
                  <span className={`w-7 h-7 rounded-full ${managerColorFor(project.manager_id)} text-white text-xs font-semibold flex items-center justify-center`}>
                    {managerName ? getInitials(managerName) : '—'}
                  </span>
                  <span className="text-xs text-slate-500 truncate">{managerName ?? 'Geen manager'}</span>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {!isLoading && !error && projects && projects.length === 0 && (
        <EmptyState
          icon={<FolderKanban size={28} />}
          title="Nog geen projecten"
          description="Maak uw eerste project aan om aan de slag te gaan."
          action={{ label: '+ Nieuw project', onClick: () => setShowNewModal(true) }}
        />
      )}

      {!isLoading && !error && projects && projects.length > 0 && filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg font-medium">Geen projecten gevonden</p>
          <p className="text-sm mt-1">Pas uw zoekopdracht of filters aan</p>
        </div>
      )}

      <NewProjectModal isOpen={showNewModal} onClose={() => setShowNewModal(false)} />
    </div>
  )
}
