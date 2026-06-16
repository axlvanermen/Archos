import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, ShieldCheck, ShieldQuestion, AlertTriangle, Star } from 'lucide-react'
import { getComplianceStatus, type ComplianceLevel } from '@/lib/compliance'
import { formatCurrency, formatDate } from '@/lib/utils'

const mockSubcontractor = {
  id: '1',
  name: 'Elektro Peeters BVBA',
  vat_number: 'BE0123456789',
  specialty: 'Elektriciteit',
  contact_person: 'Jan Peeters',
  email: 'info@elektropeeters.be',
  phone: '011 22 33 44',
  address: 'Industrielaan 12',
  city: 'Hasselt',
  postal_code: '3500',
  country: 'België',
  hourly_rate: 48,
  rating: 4,
  vca_expiry_date: '2027-03-15' as string | null,
  rsz_attestation_expiry_date: '2026-09-01' as string | null,
  insurance_expiry_date: '2026-08-20' as string | null,
  notes: 'Werkt al meerdere jaren samen met ons op elektriciteitswerken. Snel beschikbaar en betrouwbaar.',
}

const complianceCardConfig: Record<ComplianceLevel, { className: string; icon: typeof ShieldCheck; iconClassName: string }> = {
  unknown: { className: 'bg-slate-50 border-slate-200', icon: ShieldQuestion, iconClassName: 'text-slate-400' },
  ok: { className: 'bg-emerald-50 border-emerald-200', icon: ShieldCheck, iconClassName: 'text-emerald-600' },
  warning: { className: 'bg-amber-50 border-amber-200', icon: AlertTriangle, iconClassName: 'text-amber-600' },
  critical: { className: 'bg-red-50 border-red-200', icon: AlertTriangle, iconClassName: 'text-red-600' },
}

function ComplianceItem({ label, expiryDate }: { label: string; expiryDate: string | null }) {
  const status = getComplianceStatus(expiryDate)
  const config = complianceCardConfig[status.level]
  const Icon = config.icon

  return (
    <div className={`rounded-xl border p-4 ${config.className}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} className={config.iconClassName} />
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      </div>
      <p className="text-sm font-semibold text-[#0F172A] mb-0.5">{status.label}</p>
      <p className="text-xs text-slate-500">
        {expiryDate
          ? `Vervaldatum: ${formatDate(expiryDate)}${status.daysRemaining !== null ? ` (${status.daysRemaining >= 0 ? `nog ${status.daysRemaining} dagen` : `${Math.abs(status.daysRemaining)} dagen verlopen`})` : ''}`
          : 'Geen vervaldatum geregistreerd'}
      </p>
    </div>
  )
}

function RatingStars({ rating }: { rating: number | null }) {
  if (rating === null) return <span className="text-sm text-slate-400">Geen beoordeling</span>
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? 'fill-[#C4943A] text-[#C4943A]' : 'text-slate-200'}
        />
      ))}
    </div>
  )
}

export default function SubcontractorDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const s = mockSubcontractor

  void id

  const fields = [
    { label: 'Naam', value: s.name },
    { label: 'BTW-nummer', value: s.vat_number ?? '—' },
    { label: 'Specialiteit', value: s.specialty },
    { label: 'Contactpersoon', value: s.contact_person ?? '—' },
    { label: 'E-mailadres', value: s.email ?? '—' },
    { label: 'Telefoonnummer', value: s.phone ?? '—' },
    { label: 'Adres', value: s.address ?? '—' },
    { label: 'Stad', value: s.city ? `${s.postal_code} ${s.city}` : '—' },
    { label: 'Land', value: s.country },
    { label: 'Uurtarief', value: s.hourly_rate !== null ? `${formatCurrency(s.hourly_rate)} / uur` : '—' },
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Back + header */}
      <div className="flex items-start gap-4 mb-6">
        <button
          onClick={() => navigate('/onderaannemers')}
          className="flex-shrink-0 mt-1 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-slate-500"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-[#0F172A]">{s.name}</h1>
            <span className="px-2.5 py-0.5 bg-slate-50 text-slate-600 border border-slate-200 text-xs font-medium rounded-full">{s.specialty}</span>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-400 font-mono">{s.vat_number ?? '—'}</p>
            <RatingStars rating={s.rating} />
          </div>
        </div>
        <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
          <Edit size={15} /> Bewerken
        </button>
      </div>

      {/* Compliance status card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm mb-6">
        <h3 className="font-semibold text-[#0F172A] mb-4">Compliance status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ComplianceItem label="VCA-attest" expiryDate={s.vca_expiry_date} />
          <ComplianceItem label="RSZ-attest" expiryDate={s.rsz_attestation_expiry_date} />
          <ComplianceItem label="Verzekering" expiryDate={s.insurance_expiry_date} />
        </div>
      </div>

      {/* Field grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="font-semibold text-[#0F172A] mb-4">Gegevens</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {fields.map((f) => (
              <div key={f.label}>
                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">{f.label}</dt>
                <dd className="text-sm font-medium text-[#0F172A]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        {s.notes && (
          <div className="md:col-span-2 bg-amber-50 border border-amber-100 rounded-2xl p-5">
            <h3 className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1.5">Interne notities</h3>
            <p className="text-sm text-amber-800">{s.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
