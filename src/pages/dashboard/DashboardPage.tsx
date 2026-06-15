import { motion } from 'framer-motion'
import { FolderKanban, FileText, CheckSquare, Receipt, Plus, ArrowRight, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency, getGreeting } from '@/lib/utils'

const mockStats = [
  { label: 'Actieve projecten', value: 12, icon: FolderKanban, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
  { label: 'Openstaande offertes', value: 4, icon: FileText, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
  { label: 'Taken vandaag', value: 7, icon: CheckSquare, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
  { label: 'Openstaande facturen', value: formatCurrency(28500), icon: Receipt, color: 'bg-red-50 text-red-600', border: 'border-red-100', sub: '3 facturen' },
]

const mockActivity = [
  { id: 1, initials: 'JP', name: 'Jan Peeters', action: 'heeft oplevering bevestigd op', project: 'Villa Knokke', time: '14 min geleden', color: 'bg-blue-500' },
  { id: 2, initials: 'SC', name: 'Sarah Claes', action: 'heeft offerte verstuurd voor', project: 'Kantoorgebouw Hasselt', time: '1u geleden', color: 'bg-purple-500' },
  { id: 3, initials: 'TM', name: 'Tom Martens', action: 'heeft taak afgerond op', project: 'Appartement Gent', time: '2u geleden', color: 'bg-emerald-500' },
  { id: 4, initials: 'PV', name: 'Pieter VDB', action: 'heeft factuur aangemaakt voor', project: 'Woning Leuven', time: 'Gisteren', color: 'bg-amber-500' },
  { id: 5, initials: 'LB', name: 'Lisa Bogaert', action: 'heeft contract ondertekend op', project: 'Residentie Brugge', time: 'Gisteren', color: 'bg-rose-500' },
]

const mockDeadlines = [
  { id: 1, project: 'Villa Knokke', task: 'Oplevering', date: 'Vandaag', urgency: 'red' },
  { id: 2, project: 'Kantoorgebouw Hasselt', task: 'HVAC-inspectie', date: 'Morgen', urgency: 'orange' },
  { id: 3, project: 'Appartement Gent', task: 'Betonstort fase 2', date: '18/06/2025', urgency: 'green' },
  { id: 4, project: 'Woning Leuven', task: 'Ruwbouw afronding', date: '20/06/2025', urgency: 'green' },
]

const urgencyConfig = {
  red: 'bg-red-500',
  orange: 'bg-amber-500',
  green: 'bg-emerald-500',
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } }

export default function DashboardPage() {
  const navigate = useNavigate()
  const greeting = getGreeting('Axl')
  const today = new Date().toLocaleDateString('nl-BE', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A]">{greeting}</h1>
        <p className="text-slate-500 text-sm mt-0.5 capitalize">{today}</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {mockStats.map((stat) => (
          <motion.div key={stat.label} variants={item} className={`bg-white rounded-2xl border p-5 shadow-sm ${stat.border}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div className="text-2xl font-bold text-[#0F172A] leading-none">{stat.value}</div>
            {stat.sub && <div className="text-xs text-slate-400 mt-0.5">{stat.sub}</div>}
            <div className="text-xs font-medium text-slate-500 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => navigate('/projecten/nieuw')}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Plus size={16} /> Nieuw project
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-[#0F172A] text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
          <Plus size={16} /> Nieuwe offerte
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-[#0F172A] text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
          <Plus size={16} /> Nieuwe taak
        </button>
      </motion.div>

      {/* Activity + Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-[#0F172A]">Recente activiteit</h2>
            <button className="text-xs text-[#C4943A] font-medium flex items-center gap-1 hover:underline cursor-pointer">
              Alles <ArrowRight size={12} />
            </button>
          </div>
          <ul className="divide-y divide-slate-50">
            {mockActivity.map((a) => (
              <li key={a.id} className="flex items-start gap-3 px-6 py-3.5">
                <span className={`flex-shrink-0 w-8 h-8 rounded-full ${a.color} text-white text-xs font-semibold flex items-center justify-center mt-0.5`}>
                  {a.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[#0F172A] leading-snug">
                    <span className="font-medium">{a.name}</span>{' '}
                    {a.action}{' '}
                    <span className="font-medium text-[#C4943A]">{a.project}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <Clock size={11} /> {a.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Deadlines */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-[#0F172A]">Deadlines deze week</h2>
            <button
              onClick={() => navigate('/planning')}
              className="text-xs text-[#C4943A] font-medium flex items-center gap-1 hover:underline cursor-pointer"
            >
              Planning <ArrowRight size={12} />
            </button>
          </div>
          <ul className="divide-y divide-slate-50">
            {mockDeadlines.map((d) => (
              <li key={d.id} className="flex items-center gap-3 px-6 py-3.5">
                <span className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${urgencyConfig[d.urgency as keyof typeof urgencyConfig]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0F172A] truncate">{d.task}</p>
                  <p className="text-xs text-slate-400 truncate">{d.project}</p>
                </div>
                <span className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  d.urgency === 'red' ? 'bg-red-50 text-red-600' :
                  d.urgency === 'orange' ? 'bg-amber-50 text-amber-600' :
                  'bg-emerald-50 text-emerald-700'
                }`}>
                  {d.date}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
