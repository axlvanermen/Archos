import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ContractStatusBadge, contractStatusFilters, type ContractStatus } from './contractStatus'
import { mockContracts, getProjectById, getClientById } from './mockContractData'

export default function ContractsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<ContractStatus | 'alle'>('alle')

  const filtered = mockContracts.filter((c) => {
    const project = getProjectById(c.projectId)
    const client = getClientById(c.clientId)
    const q = search.toLowerCase()
    const matchesSearch =
      c.reference.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      (project?.name.toLowerCase().includes(q) ?? false) ||
      (client?.name.toLowerCase().includes(q) ?? false)
    const matchesStatus = activeFilter === 'alle' || c.status === activeFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#0F172A]">Contracten</h1>
          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-full">{filtered.length}</span>
        </div>
        <button
          onClick={() => navigate('/contracten/nieuw')}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Plus size={16} /> Nieuw contract
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Zoek op referentie, titel, project of klant…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C4943A] focus:border-transparent"
          />
        </div>
      </div>

      {/* Status pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
        {contractStatusFilters.map((f) => (
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
        {filtered.map((contract) => {
          const project = getProjectById(contract.projectId)
          const client = getClientById(contract.clientId)
          return (
            <motion.div
              key={contract.id}
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
              onClick={() => navigate(`/contracten/${contract.id}`)}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-[#0F172A] truncate group-hover:text-[#C4943A] transition-colors">{contract.title}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{contract.reference}</p>
                </div>
                <ContractStatusBadge status={contract.status} />
              </div>

              <p className="text-sm text-slate-600 mb-1 truncate">{project?.name ?? '—'}</p>
              <p className="text-xs text-slate-400 mb-3 truncate">{client?.name ?? '—'}</p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                <span className="text-sm font-semibold text-[#0F172A]">{formatCurrency(contract.contractValue)}</span>
                <span className="text-xs text-slate-400">
                  {contract.signDate ? formatDate(contract.signDate) : 'Nog niet ondertekend'}
                </span>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg font-medium">Geen contracten gevonden</p>
          <p className="text-sm mt-1">Pas uw zoekopdracht of filters aan</p>
        </div>
      )}
    </div>
  )
}
