import { useState } from 'react'
import {
  Building2,
  Thermometer,
  Zap,
  Droplets,
  HardHat,
  Hammer,
  PaintBucket,
  Wrench,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { CompanyType } from '@/types'

interface Props {
  onNext: () => void
  onBack: () => void
}

interface TypeOption {
  value: CompanyType
  label: string
  description: string
  Icon: React.ElementType
}

const TYPE_OPTIONS: TypeOption[] = [
  {
    value: 'aannemer' as CompanyType,
    label: 'Algemeen aannemer',
    description: 'Ruwbouw, renovatie en algemene bouwwerken',
    Icon: Building2,
  },
  {
    value: 'onderaannemer' as CompanyType,
    label: 'HVAC & verwarming',
    description: 'Verwarmings- en klimaatinstallaties',
    Icon: Thermometer,
  },
  {
    value: 'ingenieur' as CompanyType,
    label: 'Elektriciteit',
    description: 'Elektrische installaties en bekabeling',
    Icon: Zap,
  },
  {
    value: 'leverancier' as CompanyType,
    label: 'Sanitair & loodgieter',
    description: 'Water- en sanitaire installaties',
    Icon: Droplets,
  },
  {
    value: 'architect' as CompanyType,
    label: 'Architect & ontwerp',
    description: 'Architectuur, ontwerp en studiebureau',
    Icon: HardHat,
  },
  {
    value: 'opdrachtgever' as CompanyType,
    label: 'Timmerwerk & schrijnwerk',
    description: 'Houtbouw, ramen, deuren en interieurbouw',
    Icon: Hammer,
  },
  {
    value: 'overheid' as CompanyType,
    label: 'Schilder & afwerking',
    description: 'Schilderwerken, behang en afwerkingen',
    Icon: PaintBucket,
  },
  {
    value: 'andere' as CompanyType,
    label: 'Andere technische werken',
    description: 'Dakwerken, vloeren, isolatie en meer',
    Icon: Wrench,
  },
]

export default function StepBedrijfsType({ onNext, onBack }: Props) {
  const [selected, setSelected] = useState<CompanyType | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleNext = async () => {
    if (!selected) return
    setIsSaving(true)
    setError(null)

    try {
      // Update company type in database
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: userRecord } = await supabase
          .from('users')
          .select('company_id')
          .eq('id', user.id)
          .single()

        if (userRecord?.company_id) {
          await supabase
            .from('companies')
            .update({ type: selected })
            .eq('id', userRecord.company_id)
        }
      }
      onNext()
    } catch {
      setError('Kon bedrijfstype niet opslaan. U kunt dit later aanpassen.')
      onNext() // Continue anyway
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-primary)' }}>
          Type bouwbedrijf
        </h2>
        <p className="text-sm text-slate-500">
          Kies het type dat het beste bij uw activiteiten aansluit.
        </p>
      </div>

      {error && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {TYPE_OPTIONS.map(({ value, label, description, Icon }) => {
          const isSelected = selected === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => setSelected(value)}
              className={`relative flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all
                ${isSelected
                  ? 'border-[var(--color-accent)] bg-amber-50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors
                  ${isSelected ? 'bg-[var(--color-accent)]' : 'bg-slate-100'}`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${isSelected ? 'text-white' : 'text-slate-500'}`}
                />
              </div>
              <div>
                <p className={`text-sm font-semibold transition-colors
                  ${isSelected ? 'text-[var(--color-accent)]' : 'text-slate-800'}`}>
                  {label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
              </div>

              {isSelected && (
                <div
                  className="absolute top-3 right-3 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--color-accent)' }}
                >
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold border border-slate-200 text-slate-600
            hover:bg-slate-50 transition-all"
        >
          Terug
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!selected || isSaving}
          className="flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold text-white
            hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'var(--color-primary)' }}
        >
          {isSaving ? 'Opslaan...' : 'Volgende stap'}
        </button>
      </div>
    </div>
  )
}
