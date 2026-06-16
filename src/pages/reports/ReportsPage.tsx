import { motion } from 'framer-motion'
import { TrendingUp, Wallet, Layers, Target } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { monthlyRevenue, projectStatusBreakdown, topClients, kpiSummary } from './mockReportData'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } }

const kpis = [
  {
    label: 'Totale omzet',
    value: formatCurrency(kpiSummary.totalRevenue),
    icon: TrendingUp,
    color: 'bg-emerald-50 text-emerald-600',
    border: 'border-emerald-100',
    sub: 'Over 6 projecten',
  },
  {
    label: 'Openstaand saldo',
    value: formatCurrency(kpiSummary.outstandingBalance),
    icon: Wallet,
    color: 'bg-red-50 text-red-600',
    border: 'border-red-100',
    sub: 'Nog te innen',
  },
  {
    label: 'Gem. projectwaarde',
    value: formatCurrency(kpiSummary.averageProjectValue),
    icon: Layers,
    color: 'bg-blue-50 text-blue-600',
    border: 'border-blue-100',
    sub: 'Per project',
  },
  {
    label: 'Win rate offerte → opdracht',
    value: `${Math.round(kpiSummary.winRate * 100)}%`,
    icon: Target,
    color: 'bg-amber-50 text-amber-600',
    border: 'border-amber-100',
    sub: 'Laatste 6 maanden',
  },
]

const maxMonthly = Math.max(...monthlyRevenue.map((m) => Math.max(m.invoiced, m.paid)))
const maxStatusCount = Math.max(...projectStatusBreakdown.map((s) => s.count))

export default function ReportsPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A]">Rapporten</h1>
        <p className="text-slate-500 text-sm mt-0.5">Overzicht — laatste 6 maanden</p>
      </motion.div>

      {/* KPI cards */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => (
          <motion.div key={kpi.label} variants={item} className={`bg-white rounded-2xl border p-5 shadow-sm ${kpi.border}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${kpi.color}`}>
              <kpi.icon size={20} />
            </div>
            <div className="text-2xl font-bold text-[#0F172A] leading-none">{kpi.value}</div>
            {kpi.sub && <div className="text-xs text-slate-400 mt-0.5">{kpi.sub}</div>}
            <div className="text-xs font-medium text-slate-500 mt-1">{kpi.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Bar chart: monthly invoiced vs paid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-[#0F172A]">Facturatie per maand</h2>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#0F172A]" /> Gefactureerd
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#C4943A]" /> Betaald
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between gap-3 h-56">
            {monthlyRevenue.map((m, i) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="flex items-end gap-1 h-full">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(m.invoiced / maxMonthly) * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.1 * i, ease: 'easeOut' }}
                    className="w-4 sm:w-6 rounded-t-md bg-[#0F172A]"
                    title={formatCurrency(m.invoiced)}
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(m.paid / maxMonthly) * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.1 * i + 0.05, ease: 'easeOut' }}
                    className="w-4 sm:w-6 rounded-t-md bg-[#C4943A]"
                    title={formatCurrency(m.paid)}
                  />
                </div>
                <span className="text-xs font-medium text-slate-500">{m.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Project status breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
        >
          <h2 className="font-semibold text-[#0F172A] mb-5">Projectstatus</h2>
          <div className="space-y-4">
            {projectStatusBreakdown.map((s, i) => (
              <div key={s.status}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-2 text-sm text-slate-600">
                    <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                    {s.label}
                  </span>
                  <span className="text-sm font-semibold text-[#0F172A]">{s.count}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(s.count / maxStatusCount) * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.1 * i, ease: 'easeOut' }}
                    className={`h-full rounded-full ${s.bar}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top clients */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.36 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm"
      >
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-[#0F172A]">Top klanten</h2>
        </div>
        <ul className="divide-y divide-slate-50">
          {topClients.map((c) => (
            <li key={c.rank} className="flex items-center gap-4 px-6 py-3.5">
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  c.rank === 1
                    ? 'bg-[#C4943A] text-white'
                    : c.rank === 2
                    ? 'bg-slate-300 text-slate-700'
                    : c.rank === 3
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {c.rank}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0F172A] truncate">{c.name}</p>
                <p className="text-xs text-slate-400 truncate">{c.projectName}</p>
              </div>
              <span className="text-sm font-semibold text-[#0F172A]">{formatCurrency(c.revenue)}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  )
}
