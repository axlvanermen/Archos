import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, User, FolderKanban } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatCurrency, formatDate } from '@/lib/utils'

const mockClient = {
  id: '1',
  name: 'Familie De Groote',
  vat_number: null as string | null,
  contact_person: 'Jan De Groote',
  email: 'jan.degroote@gmail.com',
  phone: '0470 12 34 56',
  address: 'Zeedijk 145',
  city: 'Knokke-Heist',
  postal_code: '8300',
  country: 'België',
  notes: 'Voorkeur voor communicatie via e-mail. Beschikbaar voor werfbezoeken op woensdagnamiddag.',
}

const mockClientProjects = [
  { id: '1', number: '2025-001', name: 'Villa Knokke', status: 'oplevering' as const, budget: 380000, startDate: '2025-01-10', endDate: '2025-06-30' },
]

const tabs = [
  { id: 'algemeen', label: 'Algemeen', icon: User },
  { id: 'projecten', label: 'Projecten', icon: FolderKanban },
]

function AlgemeenTab() {
  const c = mockClient
  const fields = [
    { label: 'Naam', value: c.name },
    { label: 'BTW-nummer', value: c.vat_number ?? '—' },
    { label: 'Contactpersoon', value: c.contact_person ?? '—' },
    { label: 'E-mailadres', value: c.email ?? '—' },
    { label: 'Telefoonnummer', value: c.phone ?? '—' },
    { label: 'Adres', value: c.address ?? '—' },
    { label: 'Stad', value: c.city ? `${c.postal_code} ${c.city}` : '—' },
    { label: 'Land', value: c.country },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h3 className="font-semibold text-[#0F172A] mb-4">Klantgegevens</h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          {fields.map((f) => (
            <div key={f.label}>
              <dt className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">{f.label}</dt>
              <dd className="text-sm font-medium text-[#0F172A]">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      {c.notes && (
        <div className="md:col-span-2 bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <h3 className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1.5">Interne notities</h3>
          <p className="text-sm text-amber-800">{c.notes}</p>
        </div>
      )}
    </div>
  )
}

function ProjectenTab() {
  const navigate = useNavigate()

  if (mockClientProjects.length === 0) {
    return (
      <EmptyState
        icon={<FolderKanban size={28} />}
        title="Geen projecten"
        description="Deze klant heeft nog geen gekoppelde projecten."
      />
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
      {mockClientProjects.map((p) => (
        <div
          key={p.id}
          onClick={() => navigate(`/projecten/${p.id}`)}
          className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="font-semibold text-[#0F172A] truncate">{p.name}</h4>
              <StatusBadge status={p.status} />
            </div>
            <p className="text-xs text-slate-400 font-mono">{p.number} · {formatDate(p.startDate)} → {formatDate(p.endDate)}</p>
          </div>
          <span className="flex-shrink-0 text-sm font-semibold text-[#0F172A]">{formatCurrency(p.budget)}</span>
        </div>
      ))}
    </div>
  )
}

export default function ClientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('algemeen')

  void id

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Back + header */}
      <div className="flex items-start gap-4 mb-6">
        <button
          onClick={() => navigate('/klanten')}
          className="flex-shrink-0 mt-1 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-slate-500"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-[#0F172A] mb-1">{mockClient.name}</h1>
          <p className="text-sm text-slate-400">{mockClient.contact_person ?? mockClient.email ?? '—'}</p>
        </div>
        <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
          <Edit size={15} /> Bewerken
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-100 mb-6 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer -mb-px ${
              activeTab === tab.id
                ? 'border-[#C4943A] text-[#C4943A]'
                : 'border-transparent text-slate-500 hover:text-[#0F172A]'
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'algemeen' && <AlgemeenTab />}
      {activeTab === 'projecten' && <ProjectenTab />}
    </div>
  )
}
