import { useState } from 'react'
import { AlertCircle, Loader2, Eye, EyeOff, Building2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { CompanyType } from '@/types'

interface Props {
  onNext: () => void
  onBack: () => void
}

// Belgian VAT: BE XXXX.XXX.XXX
const VAT_REGEX = /^BE\s?\d{4}\.\d{3}\.\d{3}$/

function formatVat(raw: string): string {
  // Strip non-digits after prefix
  const digits = raw.replace(/^BE\s?/i, '').replace(/\D/g, '')
  if (!digits) return 'BE '
  const d1 = digits.slice(0, 4)
  const d2 = digits.slice(4, 7)
  const d3 = digits.slice(7, 10)
  let formatted = `BE ${d1}`
  if (d2) formatted += `.${d2}`
  if (d3) formatted += `.${d3}`
  return formatted
}

export default function StepBedrijfsInfo({ onNext }: Props) {
  const [form, setForm] = useState({
    companyName: '',
    vatNumber: 'BE ',
    address: '',
    city: '',
    postalCode: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const set = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleVatChange = (raw: string) => {
    // Allow typing naturally, format on the fly
    if (!raw.startsWith('BE') && raw.toUpperCase().startsWith('BE')) {
      raw = 'BE ' + raw.slice(2).trim()
    }
    if (!raw.toUpperCase().startsWith('BE')) return
    const digits = raw.replace(/^BE\s?/i, '').replace(/\D/g, '').slice(0, 10)
    set('vatNumber', formatVat('BE ' + digits))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!form.companyName.trim()) newErrors.companyName = 'Bedrijfsnaam is verplicht.'
    if (!form.address.trim()) newErrors.address = 'Adres is verplicht.'
    if (!form.city.trim()) newErrors.city = 'Gemeente is verplicht.'
    if (!form.postalCode.trim()) newErrors.postalCode = 'Postcode is verplicht.'

    if (form.vatNumber.trim() !== 'BE ' && form.vatNumber.trim() !== 'BE') {
      if (!VAT_REGEX.test(form.vatNumber.trim())) {
        newErrors.vatNumber = 'Gebruik het formaat BE XXXX.XXX.XXX'
      }
    }

    if (!form.adminEmail.trim()) {
      newErrors.adminEmail = 'E-mailadres is verplicht.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.adminEmail)) {
      newErrors.adminEmail = 'Ongeldig e-mailadres.'
    }

    if (!form.adminPassword) {
      newErrors.adminPassword = 'Wachtwoord is verplicht.'
    } else if (form.adminPassword.length < 8) {
      newErrors.adminPassword = 'Wachtwoord moet minstens 8 tekens bevatten.'
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Bevestig uw wachtwoord.'
    } else if (form.adminPassword !== form.confirmPassword) {
      newErrors.confirmPassword = 'Wachtwoorden komen niet overeen.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    setServerError(null)

    try {
      // 1. Register the admin user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: form.adminEmail.trim(),
        password: form.adminPassword,
      })

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setServerError('Dit e-mailadres is al geregistreerd.')
        } else {
          setServerError(signUpError.message)
        }
        return
      }

      if (!authData.user) {
        setServerError('Registratie mislukt. Probeer het opnieuw.')
        return
      }

      // 2. Insert company record
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: form.companyName.trim(),
          vat_number: form.vatNumber.trim() === 'BE ' ? null : form.vatNumber.trim(),
          address: `${form.address.trim()}, ${form.postalCode.trim()} ${form.city.trim()}`,
          country: 'BE',
          email: form.adminEmail.trim(),
          type: 'aannemer' as CompanyType,
        })
        .select()
        .single()

      if (companyError) {
        setServerError('Bedrijf kon niet worden aangemaakt. Probeer het opnieuw.')
        return
      }

      // 3. Insert user profile record
      await supabase.from('users').insert({
        id: authData.user.id,
        company_id: companyData.id,
        email: form.adminEmail.trim(),
        full_name: form.adminEmail.trim().split('@')[0],
        role: 'owner',
        language: 'nl',
        is_active: true,
      })

      onNext()
    } catch {
      setServerError('Er is een onverwachte fout opgetreden.')
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = (field: string) =>
    `w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white text-slate-900 placeholder-slate-400
    transition-all outline-none
    focus:ring-2 focus:ring-opacity-20
    ${errors[field]
      ? 'border-red-300 focus:border-red-400 focus:ring-red-300'
      : 'border-slate-200 focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]'
    }`

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-primary)' }}>
          Bedrijfsgegevens
        </h2>
        <p className="text-sm text-slate-500">Vertel ons meer over uw bouwbedrijf.</p>
      </div>

      {serverError && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-100">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{serverError}</p>
        </div>
      )}

      {/* Company name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Bedrijfsnaam <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={form.companyName}
            onChange={(e) => set('companyName', e.target.value)}
            placeholder="Mijn Bouwbedrijf BV"
            className={`${inputClass('companyName')} pl-9`}
            disabled={isLoading}
          />
        </div>
        {errors.companyName && <p className="mt-1 text-xs text-red-600">{errors.companyName}</p>}
      </div>

      {/* VAT number */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          BTW-nummer
          <span className="ml-1 text-xs font-normal text-slate-400">(optioneel)</span>
        </label>
        <input
          type="text"
          value={form.vatNumber}
          onChange={(e) => handleVatChange(e.target.value)}
          placeholder="BE 0123.456.789"
          className={inputClass('vatNumber')}
          disabled={isLoading}
          maxLength={16}
        />
        {errors.vatNumber && <p className="mt-1 text-xs text-red-600">{errors.vatNumber}</p>}
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Straat en nummer <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.address}
          onChange={(e) => set('address', e.target.value)}
          placeholder="Bouwstraat 12"
          className={inputClass('address')}
          disabled={isLoading}
        />
        {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
      </div>

      {/* Postal + City */}
      <div className="grid grid-cols-5 gap-3">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Postcode <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.postalCode}
            onChange={(e) => set('postalCode', e.target.value)}
            placeholder="9000"
            className={inputClass('postalCode')}
            disabled={isLoading}
            maxLength={4}
          />
          {errors.postalCode && <p className="mt-1 text-xs text-red-600">{errors.postalCode}</p>}
        </div>
        <div className="col-span-3">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Gemeente <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => set('city', e.target.value)}
            placeholder="Gent"
            className={inputClass('city')}
            disabled={isLoading}
          />
          {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
        </div>
      </div>

      <div className="pt-1 border-t border-slate-100">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Beheerdersaccount</h3>

        {/* Admin email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            E-mailadres <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={form.adminEmail}
            onChange={(e) => set('adminEmail', e.target.value)}
            placeholder="admin@bedrijf.be"
            className={inputClass('adminEmail')}
            disabled={isLoading}
          />
          {errors.adminEmail && <p className="mt-1 text-xs text-red-600">{errors.adminEmail}</p>}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Wachtwoord <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.adminPassword}
              onChange={(e) => set('adminPassword', e.target.value)}
              placeholder="Minstens 8 tekens"
              className={`${inputClass('adminPassword')} pr-10`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.adminPassword && <p className="mt-1 text-xs text-red-600">{errors.adminPassword}</p>}
        </div>

        {/* Confirm password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Bevestig wachtwoord <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={(e) => set('confirmPassword', e.target.value)}
              placeholder="Herhaal wachtwoord"
              className={`${inputClass('confirmPassword')} pr-10`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
        </div>
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white
            transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
          style={{ background: 'var(--color-primary)' }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Account aanmaken...
            </>
          ) : (
            'Volgende stap'
          )}
        </button>
      </div>
    </form>
  )
}
