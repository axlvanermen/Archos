import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  Building2,
  Palette,
  Users,
  CreditCard,
  Upload,
  Check,
  Plus,
  X,
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { UserRole, SubscriptionPlan } from '@/types'
import { mockTeamMembers, roleLabels, roleBadgeClasses, mockCompanyProfile, type TeamMember } from './mockSettingsData'

type TabId = 'bedrijfsprofiel' | 'branding' | 'team' | 'abonnement'

const tabs: { id: TabId; label: string; icon: typeof Building2 }[] = [
  { id: 'bedrijfsprofiel', label: 'Bedrijfsprofiel', icon: Building2 },
  { id: 'branding', label: 'Branding', icon: Palette },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'abonnement', label: 'Abonnement', icon: CreditCard },
]

const inputClass = 'w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C4943A] focus:border-transparent placeholder:text-slate-400'

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ─── Bedrijfsprofiel ──────────────────────────────────────────────────────

const profileSchema = z.object({
  name: z.string().min(2, 'Bedrijfsnaam is verplicht'),
  vat_number: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional().refine((v) => !v || z.string().email().safeParse(v).success, 'Ongeldig e-mailadres'),
  website: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

function BedrijfsprofielTab() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: mockCompanyProfile,
  })

  const onSubmit = async (data: ProfileFormData) => {
    await new Promise((r) => setTimeout(r, 400))
    console.log('Bedrijfsprofiel opgeslagen:', data)
    toast.success('Opgeslagen', { description: 'Uw bedrijfsgegevens zijn bijgewerkt.' })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Bedrijfsnaam *" error={errors.name?.message}>
          <input {...register('name')} placeholder="bv. Bouwbedrijf Archos BVBA" className={inputClass} />
        </Field>
        <Field label="BTW-nummer" error={errors.vat_number?.message}>
          <input {...register('vat_number')} placeholder="bv. BE 0123.456.789" className={inputClass} />
        </Field>
        <Field label="Adres" error={errors.address?.message}>
          <input {...register('address')} placeholder="bv. Industrielaan 42" className={inputClass} />
        </Field>
        <Field label="Postcode" error={errors.postal_code?.message}>
          <input {...register('postal_code')} placeholder="bv. 9000" className={inputClass} />
        </Field>
        <Field label="Gemeente" error={errors.city?.message}>
          <input {...register('city')} placeholder="bv. Gent" className={inputClass} />
        </Field>
        <Field label="Telefoonnummer" error={errors.phone?.message}>
          <input {...register('phone')} placeholder="bv. 09 234 56 78" className={inputClass} />
        </Field>
        <Field label="E-mailadres" error={errors.email?.message}>
          <input {...register('email')} placeholder="bv. info@archos.be" className={inputClass} />
        </Field>
        <Field label="Website" error={errors.website?.message}>
          <input {...register('website')} placeholder="bv. https://www.archos.be" className={inputClass} />
        </Field>
      </div>
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-semibold bg-[#0F172A] text-white rounded-xl hover:bg-slate-800 disabled:opacity-60 transition-colors cursor-pointer"
        >
          {isSubmitting ? 'Opslaan…' : 'Wijzigingen opslaan'}
        </button>
      </div>
    </form>
  )
}

// ─── Branding ─────────────────────────────────────────────────────────────

function BrandingTab() {
  const { theme, applyTheme } = useTheme()
  const [primary, setPrimary] = useState(theme.primary)
  const [secondary, setSecondary] = useState(theme.secondary)
  const [accent, setAccent] = useState(theme.accent)
  const [logoPreview, setLogoPreview] = useState<string | null>(theme.logoUrl ?? null)

  const updateColor = (key: 'primary' | 'secondary' | 'accent', value: string) => {
    if (key === 'primary') setPrimary(value)
    if (key === 'secondary') setSecondary(value)
    if (key === 'accent') setAccent(value)
    applyTheme({
      primary: key === 'primary' ? value : primary,
      secondary: key === 'secondary' ? value : secondary,
      accent: key === 'accent' ? value : accent,
      logoUrl: logoPreview ?? undefined,
      companyName: theme.companyName,
    })
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setLogoPreview(url)
    applyTheme({ primary, secondary, accent, logoUrl: url, companyName: theme.companyName })
    toast.success('Logo bijgewerkt', { description: 'Lokale voorvertoning toegepast.' })
  }

  const colorFields: { key: 'primary' | 'secondary' | 'accent'; label: string; value: string; hint: string }[] = [
    { key: 'primary', label: 'Primaire kleur', value: primary, hint: 'Hoofdkleur voor tekst en navigatie' },
    { key: 'secondary', label: 'Secondaire kleur', value: secondary, hint: 'Achtergronden en subtiele elementen' },
    { key: 'accent', label: 'Accentkleur', value: accent, hint: 'Knoppen en highlights' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-[#C4943A]" />
          <span className="text-sm font-semibold text-slate-700">Huisstijlkleuren</span>
        </div>
        <p className="text-xs text-slate-500 mb-4">Wijzigingen worden onmiddellijk toegepast op de hele applicatie.</p>
        <div className="space-y-3">
          {colorFields.map((field) => (
            <div key={field.key} className="flex items-center gap-3">
              <input
                type="color"
                value={field.value}
                onChange={(e) => updateColor(field.key, e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5 bg-white flex-shrink-0"
                title={field.label}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">{field.label}</span>
                  <span className="text-xs font-mono text-slate-400">{field.value}</span>
                </div>
                <p className="text-xs text-slate-400">{field.hint}</p>
              </div>
              <div className="flex-shrink-0 w-8 h-8 rounded-lg border border-slate-100 shadow-sm" style={{ background: field.value }} />
            </div>
          ))}
        </div>
      </div>

      {/* Preview strip */}
      <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: primary }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: accent }}>
          {logoPreview ? (
            <img src={logoPreview} alt="Logo" className="w-6 h-6 object-contain" />
          ) : (
            <span className="text-white text-xs font-bold">A</span>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Archos — Voorvertoning</p>
          <p className="text-xs" style={{ color: secondary }}>Zo ziet uw huisstijl eruit in de app</p>
        </div>
        <div className="ml-auto">
          <button type="button" className="px-3 py-1.5 text-xs font-semibold rounded-md transition-all" style={{ background: accent, color: 'white' }}>
            Knop
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Upload className="w-4 h-4 text-[#C4943A]" />
          <span className="text-sm font-semibold text-slate-700">Logo</span>
        </div>
        {logoPreview ? (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl border border-slate-200 bg-white flex items-center justify-center p-2">
              <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
            </div>
            <label className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
              Logo wijzigen
              <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" onChange={handleLogoChange} className="hidden" />
            </label>
          </div>
        ) : (
          <label className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#C4943A] hover:bg-amber-50/40 transition-all cursor-pointer">
            <Upload className="w-6 h-6 text-slate-300" />
            <div className="text-center">
              <p className="text-sm font-medium text-slate-500">Klik om een logo te uploaden</p>
              <p className="text-xs text-slate-400">PNG, SVG, JPG — max. 2 MB</p>
            </div>
            <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" onChange={handleLogoChange} className="hidden" />
          </label>
        )}
      </div>
    </div>
  )
}

// ─── Team ─────────────────────────────────────────────────────────────────

const inviteSchema = z.object({
  email: z.string().email('Ongeldig e-mailadres'),
  role: z.nativeEnum(UserRole),
})

type InviteFormData = z.infer<typeof inviteSchema>

function TeamTab() {
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers)
  const [showInvite, setShowInvite] = useState(false)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { role: UserRole.Worker },
  })

  const onSubmit = async (data: InviteFormData) => {
    await new Promise((r) => setTimeout(r, 300))
    const namePart = data.email.split('@')[0]
    const newMember: TeamMember = {
      id: String(Date.now()),
      name: namePart,
      initials: namePart.slice(0, 2).toUpperCase(),
      email: data.email,
      role: data.role,
      color: 'bg-slate-400',
    }
    setMembers((prev) => [...prev, newMember])
    toast.success('Uitnodiging verstuurd', { description: `${data.email} is uitgenodigd.` })
    reset()
    setShowInvite(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-slate-500">{members.length} teamleden</p>
        <button
          type="button"
          onClick={() => setShowInvite((v) => !v)}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-[#0F172A] text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {showInvite ? <X size={15} /> : <Plus size={15} />}
          {showInvite ? 'Annuleren' : 'Teamlid uitnodigen'}
        </button>
      </div>

      <AnimatePresence>
        {showInvite && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleSubmit(onSubmit)}
            className="overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row gap-3 p-4 mb-5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex-1">
                <input {...register('email')} placeholder="naam@bedrijf.be" className={inputClass} />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <select {...register('role')} className={cn(inputClass, 'sm:w-48')}>
                {Object.values(UserRole).map((r) => (
                  <option key={r} value={r}>{roleLabels[r]}</option>
                ))}
              </select>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm font-semibold bg-[#C4943A] text-white rounded-xl hover:opacity-90 disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap"
              >
                {isSubmitting ? 'Versturen…' : 'Uitnodigen'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <ul className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
        {members.map((m) => (
          <li key={m.id} className="flex items-center gap-3 px-5 py-3.5 bg-white">
            <span className={`flex-shrink-0 w-9 h-9 rounded-full ${m.color} text-white text-xs font-semibold flex items-center justify-center`}>
              {m.initials}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#0F172A] truncate">{m.name}</p>
              <p className="text-xs text-slate-400 truncate">{m.email}</p>
            </div>
            <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border', roleBadgeClasses[m.role])}>
              {roleLabels[m.role]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── Abonnement ───────────────────────────────────────────────────────────

const currentPlan: SubscriptionPlan = SubscriptionPlan.Professional

const planDetails: Record<SubscriptionPlan, { label: string; price: string; features: string[] }> = {
  [SubscriptionPlan.Free]: {
    label: 'Free',
    price: '€0/maand',
    features: ['1 project', 'Basis facturatie', 'E-mailondersteuning'],
  },
  [SubscriptionPlan.Starter]: {
    label: 'Starter',
    price: '€29/maand',
    features: ['5 projecten', 'Offertes & contracten', 'Klantenbeheer', 'E-mailondersteuning'],
  },
  [SubscriptionPlan.Professional]: {
    label: 'Professional',
    price: '€79/maand',
    features: ['Onbeperkt projecten', 'Onderaannemersbeheer', 'Rapportages', 'Prioritaire ondersteuning'],
  },
  [SubscriptionPlan.Enterprise]: {
    label: 'Enterprise',
    price: 'Op aanvraag',
    features: ['Alles in Professional', 'Eigen huisstijl & domein', 'Dedicated accountmanager', 'SLA-garantie'],
  },
}

function AbonnementTab() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#C4943A]/30 bg-[#C4943A]/5 p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[#C4943A] uppercase tracking-wide mb-1">Huidig abonnement</p>
          <p className="text-xl font-bold text-[#0F172A]">{planDetails[currentPlan].label}</p>
          <p className="text-sm text-slate-500">{planDetails[currentPlan].price}</p>
        </div>
        <button type="button" className="px-4 py-2.5 text-sm font-semibold bg-[#0F172A] text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer">
          Beheer facturatie
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.values(SubscriptionPlan).map((plan) => {
          const details = planDetails[plan]
          const isCurrent = plan === currentPlan
          return (
            <div
              key={plan}
              className={cn(
                'rounded-2xl border p-5 flex flex-col',
                isCurrent ? 'border-[#C4943A] ring-2 ring-[#C4943A]/20 bg-white' : 'border-slate-200 bg-white',
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-[#0F172A]">{details.label}</p>
                {isCurrent && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#C4943A]/10 text-[#C4943A]">Actief</span>
                )}
              </div>
              <p className="text-sm text-slate-500 mb-4">{details.price}</p>
              <ul className="space-y-2 flex-1">
                {details.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-slate-600">
                    <Check size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              {!isCurrent && (
                <button type="button" className="mt-4 w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                  Overschakelen
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('bedrijfsprofiel')

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A]">Instellingen</h1>
        <p className="text-slate-500 text-sm mt-0.5">Beheer uw bedrijfsprofiel, huisstijl, team en abonnement.</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible lg:w-56 flex-shrink-0 pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors cursor-pointer text-left',
                activeTab === tab.id
                  ? 'bg-[#0F172A] text-white'
                  : 'text-slate-600 hover:bg-slate-100',
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
        >
          {activeTab === 'bedrijfsprofiel' && <BedrijfsprofielTab />}
          {activeTab === 'branding' && <BrandingTab />}
          {activeTab === 'team' && <TeamTab />}
          {activeTab === 'abonnement' && <AbonnementTab />}
        </motion.div>
      </div>
    </div>
  )
}
