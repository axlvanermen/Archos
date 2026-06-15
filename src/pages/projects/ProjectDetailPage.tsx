import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, FolderKanban, FileText, Calendar, BookOpen, Paperclip, Receipt } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatCurrency, formatDate } from '@/lib/utils'

const mockProject = {
  id: '1',
  number: '2025-001',
  name: 'Villa Knokke',
  client: 'Familie De Groote',
  address: 'Zeedijk 145, 8300 Knokke-Heist',
  description: 'Volledige nieuwbouw van een luxevilla met 5 slaapkamers, zwembad en dubbele garage. Ruwbouw, afwerking, HVAC en buitenaanleg inbegrepen.',
  status: 'oplevering' as const,
  startDate: '2025-01-10',
  endDate: '2025-06-30',
  budget: 380000,
  invoiced: 320000,
  manager: 'Jan Peeters',
  siteManager: 'Tom Martens',
  notes: 'Klant heeft voorkeur voor witte interieurbekleding. Leveringstermijn sanitair bevestigd voor 15/06.',
}

const tabs = [
  { id: 'algemeen', label: 'Algemeen', icon: FolderKanban },
  { id: 'offerte', label: 'Offerte', icon: FileText },
  { id: 'planning', label: 'Planning', icon: Calendar },
  { id: 'dagboek', label: 'Dagboek', icon: BookOpen },
  { id: 'documenten', label: 'Documenten', icon: Paperclip },
  { id: 'facturen', label: 'Facturen', icon: Receipt },
]

function AlgemeenTab() {
  const p = mockProject
  const fields = [
    { label: 'Projectnaam', value: p.name },
    { label: 'Projectnummer', value: p.number },
    { label: 'Klant', value: p.client },
    { label: 'Werfadres', value: p.address },
    { label: 'Startdatum', value: formatDate(p.startDate) },
    { label: 'Einddatum', value: formatDate(p.endDate) },
    { label: 'Budget', value: formatCurrency(p.budget) },
    { label: 'Gefactureerd', value: formatCurrency(p.invoiced) },
    { label: 'Projectmanager', value: p.manager },
    { label: 'Werfleider', value: p.siteManager },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h3 className="font-semibold text-[#0F172A] mb-4">Projectgegevens</h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          {fields.map((f) => (
            <div key={f.label}>
              <dt className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">{f.label}</dt>
              <dd className="text-sm font-medium text-[#0F172A]">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h3 className="font-semibold text-[#0F172A] mb-2">Omschrijving werken</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{p.description}</p>
      </div>
      {p.notes && (
        <div className="md:col-span-2 bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <h3 className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1.5">Interne notities</h3>
          <p className="text-sm text-amber-800">{p.notes}</p>
        </div>
      )}
    </div>
  )
}

export default function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('algemeen')

  void id

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Back + header */}
      <div className="flex items-start gap-4 mb-6">
        <button
          onClick={() => navigate('/projecten')}
          className="flex-shrink-0 mt-1 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-slate-500"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-[#0F172A]">{mockProject.name}</h1>
            <StatusBadge status={mockProject.status} />
          </div>
          <p className="text-sm text-slate-400 font-mono">{mockProject.number} · {mockProject.client}</p>
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
      {activeTab === 'offerte' && <EmptyState icon={<FileText size={28} />} title="Nog geen offerte" description="Maak een offerte aan voor dit project." action={{ label: '+ Nieuwe offerte', onClick: () => {} }} />}
      {activeTab === 'planning' && <EmptyState icon={<Calendar size={28} />} title="Geen planning" description="Voeg fasen en taken toe om de planning op te starten." action={{ label: '+ Fase toevoegen', onClick: () => {} }} />}
      {activeTab === 'dagboek' && <EmptyState icon={<BookOpen size={28} />} title="Geen dagboekentries" description="Start uw werfverslag voor vandaag." action={{ label: '+ Entry toevoegen', onClick: () => {} }} />}
      {activeTab === 'documenten' && <EmptyState icon={<Paperclip size={28} />} title="Geen documenten" description="Upload plannen, foto's, contracten en andere bestanden." action={{ label: 'Bestand uploaden', onClick: () => {} }} />}
      {activeTab === 'facturen' && <EmptyState icon={<Receipt size={28} />} title="Geen facturen" description="Maak een factuur aan op basis van de goedgekeurde offerte." action={{ label: '+ Factuur aanmaken', onClick: () => {} }} />}
    </div>
  )
}
