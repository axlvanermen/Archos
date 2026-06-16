import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Mail, Phone, MapPin, Star, AlertTriangle, ShieldCheck, ShieldQuestion } from 'lucide-react'
import { motion } from 'framer-motion'
import { NewSubcontractorModal } from './NewSubcontractorModal'
import { getOverallComplianceStatus, type ComplianceLevel } from '@/lib/compliance'
import { formatCurrency } from '@/lib/utils'

interface SubcontractorListItem {
  id: string
  name: string
  vat_number: string | null
  specialty: string
  contact_person: string | null
  email: string | null
  phone: string | null
  city: string | null
  hourly_rate: number | null
  rating: number | null
  vca_expiry_date: string | null
  rsz_attestation_expiry_date: string | null
}

const mockSubcontractors: SubcontractorListItem[] = [
  { id: '1', name: 'Elektro Peeters BVBA', vat_number: 'BE0123456789', specialty: 'Elektriciteit', contact_person: 'Jan Peeters', email: 'info@elektropeeters.be', phone: '011 22 33 44', city: 'Hasselt', hourly_rate: 48, rating: 4, vca_expiry_date: '2027-03-15', rsz_attestation_expiry_date: '2026-09-01' },
  { id: '2', name: 'Sanitair Devos', vat_number: 'BE0234567891', specialty: 'Loodgieterij', contact_person: 'Marc Devos', email: 'marc@sanitairdevos.be', phone: '03 456 78 90', city: 'Antwerpen', hourly_rate: 52, rating: 5, vca_expiry_date: '2026-07-10', rsz_attestation_expiry_date: '2026-12-01' },
  { id: '3', name: 'Dakwerken Van Acker', vat_number: 'BE0345678912', specialty: 'Dakwerken', contact_person: 'Steven Van Acker', email: 'info@dakwerkenvanacker.be', phone: '09 333 22 11', city: 'Gent', hourly_rate: 45, rating: 4, vca_expiry_date: '2026-06-20', rsz_attestation_expiry_date: '2027-01-15' },
  { id: '4', name: 'Schilderwerken Maes', vat_number: 'BE0456789123', specialty: 'Schilderwerken', contact_person: 'Lieve Maes', email: 'lieve@schilderwerkenmaes.be', phone: '050 11 22 33', city: 'Brugge', hourly_rate: 38, rating: 3, vca_expiry_date: null, rsz_attestation_expiry_date: '2026-10-10' },
  { id: '5', name: 'Metselwerken Goris', vat_number: 'BE0567891234', specialty: 'Metselwerk', contact_person: 'Bert Goris', email: 'bert@metselwerkengoris.be', phone: '015 44 55 66', city: 'Mechelen', hourly_rate: 42, rating: 4, vca_expiry_date: '2026-08-01', rsz_attestation_expiry_date: '2026-06-25' },
  { id: '6', name: 'Vloerwerken Janssens', vat_number: 'BE0678912345', specialty: 'Andere', contact_person: 'Kris Janssens', email: 'kris@vloerwerkenjanssens.be', phone: '016 77 88 99', city: 'Leuven', hourly_rate: 40, rating: 5, vca_expiry_date: '2026-12-31', rsz_attestation_expiry_date: '2027-02-28' },
  { id: '7', name: 'Elektro Smets', vat_number: 'BE0789123456', specialty: 'Elektriciteit', contact_person: 'Wouter Smets', email: 'wouter@elektrosmets.be', phone: '011 99 88 77', city: 'Genk', hourly_rate: 50, rating: 3, vca_expiry_date: '2025-12-01', rsz_attestation_expiry_date: '2026-11-01' },
  { id: '8', name: 'Dakwerken Hermans', vat_number: 'BE0891234567', specialty: 'Dakwerken', contact_person: 'Tom Hermans', email: 'tom@dakwerkenhermans.be', phone: '02 345 67 89', city: 'Brussel', hourly_rate: 47, rating: 4, vca_expiry_date: '2026-07-05', rsz_attestation_expiry_date: '2026-06-30' },
]

const specialtyFilters = ['Alle', 'Elektriciteit', 'Loodgieterij', 'Dakwerken', 'Schilderwerken', 'Metselwerk', 'Andere'] as const

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
        <Star
          key={i}
          size={13}
          className={i < rating ? 'fill-[#C4943A] text-[#C4943A]' : 'text-slate-200'}
        />
      ))}
    </div>
  )
}

export default function SubcontractorsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<typeof specialtyFilters[number]>('Alle')
  const [showNewModal, setShowNewModal] = useState(false)

  const filtered = mockSubcontractors.filter((s) => {
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

      {/* Grid */}
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
                <h3 className="font-semibold text-[#0F172A] truncate group-hover:text-[#C4943A] transition-colors">{sub.name}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{sub.vat_number ?? '—'}</p>
              </div>
              <ComplianceBadge vcaExpiryDate={sub.vca_expiry_date} rszExpiryDate={sub.rsz_attestation_expiry_date} />
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 bg-slate-50 text-slate-600 border border-slate-200 text-xs font-medium rounded-full">{sub.specialty}</span>
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

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg font-medium">Geen onderaannemers gevonden</p>
          <p className="text-sm mt-1">Pas uw zoekopdracht of filters aan</p>
        </div>
      )}

      <NewSubcontractorModal isOpen={showNewModal} onClose={() => setShowNewModal(false)} />
    </div>
  )
}
