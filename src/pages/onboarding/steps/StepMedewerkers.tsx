import { useState } from 'react'
import { UserPlus, Trash2, Loader2, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { UserRole } from '@/types'

interface Props {
  onNext: () => void
  onBack: () => void
}

interface Employee {
  id: string
  name: string
  email: string
  role: UserRole
  nameError?: string
  emailError?: string
}

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'admin' as UserRole, label: 'Beheerder' },
  { value: 'project_manager' as UserRole, label: 'Projectleider' },
  { value: 'foreman' as UserRole, label: 'Werfleider' },
  { value: 'worker' as UserRole, label: 'Arbeider' },
  { value: 'accountant' as UserRole, label: 'Boekhouder' },
]

function generateId() {
  return Math.random().toString(36).slice(2)
}

function createEmptyEmployee(): Employee {
  return {
    id: generateId(),
    name: '',
    email: '',
    role: 'worker' as UserRole,
  }
}

export default function StepMedewerkers({ onNext, onBack }: Props) {
  const [employees, setEmployees] = useState<Employee[]>([createEmptyEmployee()])
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const updateEmployee = (id: string, field: keyof Employee, value: string) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id
          ? { ...emp, [field]: value, [`${field}Error`]: undefined }
          : emp
      )
    )
  }

  const addEmployee = () => {
    setEmployees((prev) => [...prev, createEmptyEmployee()])
  }

  const removeEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id))
  }

  const validateAll = (): boolean => {
    let valid = true
    const updated = employees.map((emp) => {
      const errors: { nameError?: string; emailError?: string } = {}
      if (!emp.name.trim()) {
        errors.nameError = 'Naam is verplicht'
        valid = false
      }
      if (!emp.email.trim()) {
        errors.emailError = 'E-mailadres is verplicht'
        valid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emp.email)) {
        errors.emailError = 'Ongeldig e-mailadres'
        valid = false
      }
      return { ...emp, ...errors }
    })
    setEmployees(updated)
    return valid
  }

  const handleSave = async () => {
    // If the only employee row is empty, just skip
    const hasAny = employees.some((e) => e.name.trim() || e.email.trim())
    if (!hasAny) {
      onNext()
      return
    }

    if (!validateAll()) return

    setIsLoading(true)
    setServerError(null)

    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) { onNext(); return }

      const { data: userRecord } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', currentUser.id)
        .single()

      if (!userRecord?.company_id) { onNext(); return }

      // Invite employees via Supabase (invite requires service role in prod;
      // here we insert pending user records)
      const inserts = employees
        .filter((e) => e.name.trim() && e.email.trim())
        .map((e) => ({
          company_id: userRecord.company_id,
          email: e.email.trim().toLowerCase(),
          full_name: e.name.trim(),
          role: e.role,
          language: 'nl' as const,
          is_active: false, // pending until they accept invite
        }))

      if (inserts.length > 0) {
        const { error } = await supabase.from('users').insert(inserts)
        if (error && !error.message.includes('duplicate')) {
          setServerError('Sommige medewerkers konden niet worden toegevoegd. Probeer het later opnieuw.')
        }
      }

      onNext()
    } catch {
      setServerError('Er is een fout opgetreden bij het opslaan.')
    } finally {
      setIsLoading(false)
    }
  }

  const inputBase =
    'w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-opacity-20'

  const inputError =
    'border-red-300 focus:border-red-400 focus:ring-red-300'

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-primary)' }}>
          Medewerkers toevoegen
        </h2>
        <p className="text-sm text-slate-500">
          Voeg uw team toe. U kunt medewerkers later ook uitnodigen vanuit de instellingen.
        </p>
      </div>

      {serverError && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-100">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{serverError}</p>
        </div>
      )}

      {/* Table header */}
      <div className="overflow-x-auto -mx-1">
        <table className="w-full min-w-[520px]">
          <thead>
            <tr>
              <th className="pb-2 text-left text-xs font-semibold text-slate-500 pl-1 w-[35%]">Naam</th>
              <th className="pb-2 text-left text-xs font-semibold text-slate-500 w-[35%]">E-mailadres</th>
              <th className="pb-2 text-left text-xs font-semibold text-slate-500 w-[22%]">Rol</th>
              <th className="pb-2 w-[8%]" />
            </tr>
          </thead>
          <tbody className="space-y-2">
            {employees.map((emp, index) => (
              <tr key={emp.id} className="align-top">
                {/* Name */}
                <td className="pr-2 pb-3 pl-1">
                  <input
                    type="text"
                    value={emp.name}
                    onChange={(e) => updateEmployee(emp.id, 'name', e.target.value)}
                    placeholder="Jan Janssen"
                    className={`${inputBase} ${emp.nameError ? inputError : ''}`}
                    disabled={isLoading}
                  />
                  {emp.nameError && (
                    <p className="mt-1 text-xs text-red-600">{emp.nameError}</p>
                  )}
                </td>

                {/* Email */}
                <td className="pr-2 pb-3">
                  <input
                    type="email"
                    value={emp.email}
                    onChange={(e) => updateEmployee(emp.id, 'email', e.target.value)}
                    placeholder="jan@bedrijf.be"
                    className={`${inputBase} ${emp.emailError ? inputError : ''}`}
                    disabled={isLoading}
                  />
                  {emp.emailError && (
                    <p className="mt-1 text-xs text-red-600">{emp.emailError}</p>
                  )}
                </td>

                {/* Role */}
                <td className="pr-2 pb-3">
                  <select
                    value={emp.role}
                    onChange={(e) => updateEmployee(emp.id, 'role', e.target.value)}
                    className={`${inputBase} cursor-pointer`}
                    disabled={isLoading}
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Remove */}
                <td className="pb-3">
                  <button
                    type="button"
                    onClick={() => removeEmployee(emp.id)}
                    disabled={employees.length === 1 || isLoading}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400
                      hover:text-red-500 hover:bg-red-50 transition-colors
                      disabled:opacity-30 disabled:cursor-not-allowed"
                    title={`Rij ${index + 1} verwijderen`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add row button */}
      <button
        type="button"
        onClick={addEmployee}
        disabled={isLoading}
        className="flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80 disabled:opacity-50"
        style={{ color: 'var(--color-accent)' }}
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: 'var(--color-accent)' }}
        >
          <UserPlus className="w-3.5 h-3.5 text-white" />
        </div>
        Medewerker toevoegen
      </button>

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold border border-slate-200 text-slate-600
            hover:bg-slate-50 transition-all"
          disabled={isLoading}
        >
          Terug
        </button>

        <button
          type="button"
          onClick={() => onNext()}
          disabled={isLoading}
          className="py-2.5 px-4 rounded-lg text-sm font-medium text-slate-500
            hover:text-slate-700 transition-colors"
        >
          Overslaan
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white
            hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'var(--color-primary)' }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Opslaan...
            </>
          ) : (
            'Uitnodigingen versturen'
          )}
        </button>
      </div>
    </div>
  )
}
