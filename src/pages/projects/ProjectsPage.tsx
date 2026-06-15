import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, SlidersHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatCurrency, formatDate } from '@/lib/utils'

type Status = 'aanvraag' | 'offerte_opmaak' | 'offerte_verstuurd' | 'gewonnen' | 'in_uitvoering' | 'oplevering' | 'gefactureerd' | 'afgerond' | 'verloren'

interface Project {
  id: string
  number: string
  name: string
  client: string
  status: Status
  startDate: string
  endDate: string
  budget: number
  invoiced: number
  manager: string
  managerInitials: string
  managerColor: string
}

const mockProjects: Project[] = [
  { id: '1', number: '2025-001', name: 'Villa Knokke', client: 'Familie De Groote', status: 'oplevering', startDate: '2025-01-10', endDate: '2025-06-30', budget: 380000, invoiced: 320000, manager: 'Jan Peeters', managerInitials: 'JP', managerColor: 'bg-blue-500' },
  { id: '2', number: '2025-002', name: 'Kantoorgebouw Hasselt', client: 'Immo Invest NV', status: 'in_uitvoering', startDate: '2025-02-01', endDate: '2025-12-15', budget: 1250000, invoiced: 480000, manager: 'Sarah Claes', managerInitials: 'SC', managerColor: 'bg-purple-500' },
  { id: '3', number: '2025-003', name: 'Appartement Gent', client: 'Stad Gent', status: 'gewonnen', startDate: '2025-04-01', endDate: '2025-10-31', budget: 620000, invoiced: 0, manager: 'Tom Martens', managerInitials: 'TM', managerColor: 'bg-emerald-500' },
  { id: '4', number: '2025-004', name: 'Woning Leuven', client: 'Dhr. Bogaert', status: 'offerte_verstuurd', startDate: '2025-06-15', endDate: '2025-11-30', budget: 285000, invoiced: 0, manager: 'Pieter VDB', managerInitials: 'PV', managerColor: 'bg-amber-500' },
  { id: '5', number: '2025-005', name: 'Residentie Brugge', client: 'Brugge Invest', status: 'gefactureerd', startDate: '2024-09-01', endDate: '2025-03-31', budget: 890000, invoiced: 890000, manager: 'Lisa Bogaert', managerInitials: 'LB', managerColor: 'bg-rose-500' },
  { id: '6', number: '2025-006', name: 'Magazijn Antwerpen', client: 'Logistiek BV', status: 'offerte_opmaak', startDate: '2025-07-01', endDate: '2025-09-30', budget: 145000, invoiced: 0, manager: 'Jan Peeters', managerInitials: 'JP', managerColor: 'bg-blue-500' },
  { id: '7', number: '2024-018', name: 'Schoolgebouw Mechelen', client: 'Gemeente Mechelen', status: 'afgerond', startDate: '2024-03-01', endDate: '2024-12-20', budget: 2100000, invoiced: 2100000, manager: 'Sarah Claes', managerInitials: 'SC', managerColor: 'bg-purple-500' },
  { id: '8', number: '2025-007', name: 'Chalet Ardennen', client: 'Familie Willems', status: 'aanvraag', startDate: '2025-08-01', endDate: '2026-02-28', budget: 175000, invoiced: 0, manager: 'Tom Martens', managerInitials: 'TM', managerColor: 'bg-emerald-500' },
]

const statusFilters: { label: string; value: Status | 'alle' }[] = [
  { label: 'Alle', value: 'alle' },
  { label: 'Aanvraag', value: 'aanvraag' },
  { label: 'Offerte', value: 'offerte_verstuurd' },
  { label: 'Opdracht', value: 'gewonnen' },
  { label: 'In uitvoering', value: 'in_uitvoering' },
  { label: 'Oplevering', value: 'oplevering' },
  { label: 'Afgerond', value: 'afgerond' },
]

export default function ProjectsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<Status | 'alle'>('alle')

  const filtered = mockProjects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase()) || p.number.includes(search)
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
          onClick={() => navigate('/projecten/nieuw')}
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

      {/* Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
      >
        {filtered.map((project) => (
          <motion.div
            key={project.id}
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
            onClick={() => navigate(`/projecten/${project.id}`)}
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-[#0F172A] truncate group-hover:text-[#C4943A] transition-colors">{project.name}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{project.number}</p>
              </div>
              <StatusBadge status={project.status} />
            </div>

            <p className="text-sm text-slate-600 mb-3 truncate">{project.client}</p>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
              <span>{formatDate(project.startDate)}</span>
              <span>→</span>
              <span>{formatDate(project.endDate)}</span>
            </div>

            {/* Budget progress */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-500">Budget</span>
                <span className="font-semibold text-[#0F172A]">{formatCurrency(project.budget)}</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C4943A] rounded-full transition-all"
                  style={{ width: `${Math.min((project.invoiced / project.budget) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">{formatCurrency(project.invoiced)} gefactureerd</p>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-50">
              <span className={`w-7 h-7 rounded-full ${project.managerColor} text-white text-xs font-semibold flex items-center justify-center`}>
                {project.managerInitials}
              </span>
              <span className="text-xs text-slate-500 truncate">{project.manager}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg font-medium">Geen projecten gevonden</p>
          <p className="text-sm mt-1">Pas uw zoekopdracht of filters aan</p>
        </div>
      )}
    </div>
  )
}
