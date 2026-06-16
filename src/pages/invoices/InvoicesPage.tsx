import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Wallet, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatCurrency, formatDate } from '@/lib/utils'
import { InvoiceStatusBadge, invoiceStatusFilters, type InvoiceStatus } from './invoiceStatus'
import { mockInvoices, getProjectById, getClientById, MOCK_TODAY } from './mockInvoiceData'

const today = new Date(MOCK_TODAY)

function isOverdue(status: InvoiceStatus, dueDate: string | null): boolean {
  if (!dueDate) return false
  if (status === 'paid' || status === 'cancelled' || status === 'credit_note') return false
  return new Date(dueDate) < today
}

export default function InvoicesPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<InvoiceStatus | 'alle'>('alle')

  const filtered = mockInvoices.filter((inv) => {
    const project = getProjectById(inv.projectId)
    const client = getClientById(inv.clientId)
    const q = search.toLowerCase()
    const matchesSearch =
      inv.reference.toLowerCase().includes(q) ||
      inv.title.toLowerCase().includes(q) ||
      (project?.name.toLowerCase().includes(q) ?? false) ||
      (client?.name.toLowerCase().includes(q) ?? false)
    const matchesStatus = activeFilter === 'alle' || inv.status === activeFilter
    return matchesSearch && matchesStatus
  })

  // Stats
  const totaalOpenstaand = mockInvoices
    .filter((inv) => inv.status === 'sent' || inv.status === 'overdue' || inv.status === 'draft')
    .reduce((sum, inv) => sum + (inv.total - inv.amountPaid), 0)

  const totaalAchterstallig = mockInvoices
    .filter((inv) => isOverdue(inv.status, inv.dueDate))
    .reduce((sum, inv) => sum + (inv.total - inv.amountPaid), 0)

  const totaalDezeMaandBetaald = mockInvoices
    .filter((inv) => inv.paymentDate && inv.paymentDate.slice(0, 7) === MOCK_TODAY.slice(0, 7))
    .reduce((sum, inv) => sum + inv.amountPaid, 0)

  const stats = [
    { label: 'Totaal openstaand', value: formatCurrency(totaalOpenstaand), icon: Wallet, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
    { label: 'Totaal achterstallig', value: formatCurrency(totaalAchterstallig), icon: AlertTriangle, color: 'bg-red-50 text-red-600', border: 'border-red-100' },
    { label: 'Deze maand betaald', value: formatCurrency(totaalDezeMaandBetaald), icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#0F172A]">Facturen</h1>
          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-full">{filtered.length}</span>
        </div>
        <button
          onClick={() => navigate('/facturen/nieuw')}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Plus size={16} /> Nieuwe factuur
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className={`bg-white rounded-2xl border p-5 shadow-sm ${stat.border}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div className="text-2xl font-bold text-[#0F172A] leading-none">{stat.value}</div>
            <div className="text-xs font-medium text-slate-500 mt-1">{stat.label}</div>
          </div>
        ))}
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
        {invoiceStatusFilters.map((f) => (
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
        {filtered.map((invoice) => {
          const project = getProjectById(invoice.projectId)
          const client = getClientById(invoice.clientId)
          const overdue = isOverdue(invoice.status, invoice.dueDate)
          const partiallyPaid = invoice.amountPaid > 0 && invoice.amountPaid < invoice.total
          const paidPct = invoice.total > 0 ? Math.min(100, Math.round((invoice.amountPaid / invoice.total) * 100)) : 0

          return (
            <motion.div
              key={invoice.id}
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
              onClick={() => navigate(`/facturen/${invoice.id}`)}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-[#0F172A] truncate group-hover:text-[#C4943A] transition-colors">{invoice.title}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{invoice.reference}</p>
                </div>
                <InvoiceStatusBadge status={invoice.status} />
              </div>

              <p className="text-sm text-slate-600 mb-1 truncate">{project?.name ?? '—'}</p>
              <p className="text-xs text-slate-400 mb-3 truncate">{client?.name ?? '—'}</p>

              {partiallyPaid && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>{formatCurrency(invoice.amountPaid)} betaald</span>
                    <span>{paidPct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#C4943A] rounded-full" style={{ width: `${paidPct}%` }} />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                <span className="text-sm font-semibold text-[#0F172A]">{formatCurrency(invoice.total)}</span>
                <span className={`text-xs ${overdue ? 'text-red-600 font-semibold' : 'text-slate-400'}`}>
                  {invoice.dueDate ? `Verv. ${formatDate(invoice.dueDate)}` : '—'}
                </span>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg font-medium">Geen facturen gevonden</p>
          <p className="text-sm mt-1">Pas uw zoekopdracht of filters aan</p>
        </div>
      )}
    </div>
  )
}
