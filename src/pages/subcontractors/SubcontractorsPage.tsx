import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Mail, Phone, MapPin, Star, AlertTriangle, ShieldCheck, ShieldQuestion, HardHat } from 'lucide-react'
import { motion } from 'framer-motion'
import { NewSubcontractorModal } from './NewSubcontractorModal'
import { getOverallComplianceStatus, type ComplianceLevel } from '@/lib/compliance'
import { formatCurrency } from '@/lib/utils'
import { useSubcontractors } from '@/hooks/useSubcontractors'
import { SkeletonCard } from '@/components/ui/LoadingSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'

const specialtyFilters = ['Alle', 'Elektriciteit', 'Loodgieterij', 'Dakwerken', 'Schilderwerken', 'Metselwerk', 'Andere'] as const
type SpecialtyFilter = typeof specialtyFilters[number]

const complianceBadgeConfig: Record<ComplianceLevel, { className: string; icon: typeof ShieldCheck }> = {
  unknown: { className: 'bg-slate-100 text-slate-500 border-slate-200', icon: ShieldQuestion },
  ok: { className: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: ShieldCheck },
  warning: { className: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertTriangle },
  critical: { className: 'bg-red-50 text-red-700 border-red-200', icon: AlertTriangle },
}

function ComplianceBadge({ vcaExpiryDate, rszExpiryDate }: { vcaExpiryDate: string | null; rszExpiryDate: string | null }) {
  const status = getOverallComplianceStatus(vcaExpiryDate, rszExpiryDate)
  const config = complianceBadgeConfig[status.level]
  const Icon = config.icon
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      <Icon size={12} />
      {status.label}
    </span>
  )
}

function RatingStars({ rating }: { rating: number | null }) {
  if (rating === null) return <span className="text-xs text-slate-400">Geen beoordeling</span>
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} className={i < rating ? 'fill-[#C4943A] text-[#C4943A]' : 'text-slate-200'} />
      ))}
    </div>
  )
}

export default function SubcontractorsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<SpecialtyFilter>('Alle')
  const [showNewModal, setShowNewModal] = useState(false)
  const { data: subcontractors, isLoading, error } = useSubcontractors()

  const filtered = (subcontractors ?? []).filter((s) => {
    const q = search.toLowerCase()
    const matchesSearch =
      s.name.toLowerCase().includes(q) ||
      (s.vat_number ?? '').toLowerCase().includes(q) ||
      (s.contact_person ?? '').toLowerCase().includes(q)
    const matchesSpecialty = activeFilter === 'Alle' || s.specialty === activeFilter
    return matchesSearch && matchesSpecialty
  })

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#0F172A]">Onderaannemers</h1>
          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-full">{filtered.length}</span>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Plus size={16} /> Nieuwe onderaannemer
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
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

      {/* Specialty pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
        {specialtyFilters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              activeFilter === f
                ? 'bg-[#0F172A] text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="text-center py-16 text-red-500">
          <p className="text-sm font-medium">Er ging iets mis bij het laden van de onderaannemers.</p>
          <p className="text-xs mt-1 text-red-400">{error instanceof Error ? error.message : String(error)}</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && (subcontractors ?? []).length === 0 && (
        <EmptyState
          icon={<HardHat size={28} />}
          title="Nog geen onderaannemers"
          description="Voeg uw eerste onderaannemer toe om samen te werken op projecten."
          action={{ label: 'Nieuwe onderaannemer', onClick: () => setShowNewModal(true) }}
        />
      )}

      {/* Grid */}
      {!isLoading && !error && filtered.length > 0 && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        >
          {filtered.map((sub) => (
            <motion.div
              key={sub.id}
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
              onClick={() => navigate(`/onderaannemers/${sub.id}`)}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-[#0F172A] line-clamp-2 group-hover:text-[#C4943A] transition-colors">{sub.name}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{sub.vat_number ?? '—'}</p>
                </div>
                <ComplianceBadge vcaExpiryDate={sub.vca_expiry_date} rszExpiryDate={sub.rsz_attestation_expiry_date} />
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 bg-slate-50 text-slate-600 border border-slate-200 text-xs font-medium rounded-full">{sub.specialty ?? '—'}</span>
                <RatingStars rating={sub.rating} />
              </div>

              {sub.hourly_rate !== null && (
                <p className="text-sm text-slate-600 mb-3">
                  <span className="font-semibold text-[#0F172A]">{formatCurrency(sub.hourly_rate)}</span> / uur
                </p>
              )}

              <div className="space-y-1.5 pt-3 border-t border-slate-50">
                {sub.city && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin size={13} className="text-slate-400 flex-shrink-0" />
                    <span className="truncate">{sub.city}</span>
                  </div>
                )}
                {sub.email && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Mail size={13} className="text-slate-400 flex-shrink-0" />
                    <span className="truncate">{sub.email}</span>
                  </div>
                )}
                {sub.phone && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Phone size={13} className="text-slate-400 flex-shrink-0" />
                    <span className="truncate">{sub.phone}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!isLoading && !error && filtered.length === 0 && (subcontractors ?? []).length > 0 && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg font-medium">Geen onderaannemers gevonden</p>
          <p className="text-sm mt-1">Pas uw zoekopdracht of filters aan</p>
        </div>
      )}

      <NewSubcontractorModal isOpen={showNewModal} onClose={() => setShowNewModal(false)} />
    </div>
  )
}
