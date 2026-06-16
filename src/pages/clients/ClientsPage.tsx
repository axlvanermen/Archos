import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Mail, Phone, MapPin, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { NewClientModal } from './NewClientModal'
import { useClients } from '@/hooks/useClients'
import { SkeletonCard } from '@/components/ui/LoadingSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'

export default function ClientsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [showNewModal, setShowNewModal] = useState(false)
  const { data: clients, isLoading, error } = useClients()

  const filtered = (clients ?? []).filter((c) => {
    const q = search.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      (c.vat_number ?? '').toLowerCase().includes(q) ||
      (c.contact_person ?? '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#0F172A]">Klanten</h1>
          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-full">{filtered.length}</span>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Plus size={16} /> Nieuwe klant
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Zoek op naam, BTW-nummer of contactpersoon…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C4943A] focus:border-transparent"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          Er ging iets mis bij het laden van de klanten: {error.message}
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          >
            {filtered.map((client) => (
              <motion.div
                key={client.id}
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
                onClick={() => navigate(`/klanten/${client.id}`)}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#0F172A] truncate group-hover:text-[#C4943A] transition-colors">{client.name}</h3>
                    {client.vat_number && <p className="text-xs text-slate-400 font-mono mt-0.5">{client.vat_number}</p>}
                  </div>
                </div>

                {client.contact_person && <p className="text-sm text-slate-600 mb-3 truncate">{client.contact_person}</p>}

                <div className="space-y-1.5 pt-3 border-t border-slate-50">
                  {client.city && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin size={13} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate">{client.city}</span>
                    </div>
                  )}
                  {client.email && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Mail size={13} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Phone size={13} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate">{client.phone}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <EmptyState
              icon={<Users size={28} />}
              title="Geen klanten gevonden"
              description={search ? 'Pas uw zoekopdracht aan.' : 'Voeg uw eerste klant toe om te starten.'}
            />
          )}
        </>
      )}

      <NewClientModal isOpen={showNewModal} onClose={() => setShowNewModal(false)} />
    </div>
  )
}
