import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Edit, User, FolderKanban } from 'lucide-react'
import { StatusBadge, type Status } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonCard } from '@/components/ui/LoadingSkeleton'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useClient } from '@/hooks/useClients'
import { supabase } from '@/lib/supabase'
import type { Client, Project } from '@/types'

const tabs = [
  { id: 'algemeen', label: 'Algemeen', icon: User },
  { id: 'projecten', label: 'Projecten', icon: FolderKanban },
]

function AlgemeenTab({ client }: { client: Client }) {
  const fields = [
    { label: 'Naam', value: client.name },
    { label: 'BTW-nummer', value: client.vat_number ?? '—' },
    { label: 'Contactpersoon', value: client.contact_person ?? '—' },
    { label: 'E-mailadres', value: client.email ?? '—' },
    { label: 'Telefoonnummer', value: client.phone ?? '—' },
    { label: 'Adres', value: client.address ?? '—' },
    { label: 'Stad', value: client.city ? `${client.postal_code ?? ''} ${client.city}`.trim() : '—' },
    { label: 'Land', value: client.country },
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
      {client.notes && (
        <div className="md:col-span-2 bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <h3 className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1.5">Interne notities</h3>
          <p className="text-sm text-amber-800">{client.notes}</p>
        </div>
      )}
    </div>
  )
}

function ProjectenTab({ clientId }: { clientId: string }) {
  const navigate = useNavigate()
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['client-projects', clientId],
    queryFn: async () => {
      const { data, error } = await supabase.from('projects').select('*').eq('client_id', clientId)
      if (error) throw error
      return data as Project[]
    },
    enabled: !!clientId,
  })

  if (isLoading) {
    return (
      <div className="space-y-3">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
        Er ging iets mis bij het laden van de projecten: {error.message}
      </div>
    )
  }

  if (!projects || projects.length === 0) {
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
      {projects.map((p) => (
        <div
          key={p.id}
          onClick={() => navigate(`/projecten/${p.id}`)}
          className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="font-semibold text-[#0F172A] truncate">{p.name}</h4>
              <StatusBadge status={p.status as Status} />
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {p.reference ?? '—'} · {p.start_date ? formatDate(p.start_date) : '—'} → {p.end_date ? formatDate(p.end_date) : '—'}
            </p>
          </div>
          <span className="flex-shrink-0 text-sm font-semibold text-[#0F172A]">{formatCurrency(p.budget ?? 0)}</span>
        </div>
      ))}
    </div>
  )
}

export default function ClientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('algemeen')
  const { data: client, isLoading, error } = useClient(id)

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
          <h1 className="text-2xl font-bold text-[#0F172A] mb-1">{client?.name ?? (isLoading ? 'Laden…' : 'Klant')}</h1>
          <p className="text-sm text-slate-400">{client?.contact_person ?? client?.email ?? '—'}</p>
        </div>
        <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
          <Edit size={15} /> Bewerken
        </button>
      </div>

      {isLoading && <SkeletonCard />}

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          Er ging iets mis bij het laden van de klant: {error.message}
        </div>
      )}

      {!isLoading && !error && client && (
        <>
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
          {activeTab === 'algemeen' && <AlgemeenTab client={client} />}
          {activeTab === 'projecten' && <ProjectenTab clientId={client.id} />}
        </>
      )}
    </div>
  )
}
