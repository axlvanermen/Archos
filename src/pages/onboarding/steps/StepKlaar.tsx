import { useEffect, useState } from 'react'
import { Check, ArrowRight, Building2, Users, Palette, HardHat } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Props {
  onNext: () => void
  onBack: () => void
}

const FEATURE_ITEMS = [
  { Icon: Building2, label: 'Projectbeheer', description: 'Alle werven op één plek' },
  { Icon: HardHat, label: 'Werfopvolging', description: 'Dagverslagen en planning' },
  { Icon: Users, label: 'Teamwork', description: 'Samenwerken met uw team' },
  { Icon: Palette, label: 'Uw huisstijl', description: 'Gepersonaliseerd dashboard' },
]

export default function StepKlaar({ onBack }: Props) {
  const [visible, setVisible] = useState(false)
  const [checkDone, setCheckDone] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const t1 = setTimeout(() => setVisible(true), 100)
    const t2 = setTimeout(() => setCheckDone(true), 600)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <div className="space-y-8">
      {/* Hero check animation */}
      <div className="text-center py-4">
        <div
          className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 transition-all duration-700
            ${visible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
          style={{ background: 'linear-gradient(135deg, var(--color-accent) 0%, #fb923c 100%)' }}
        >
          <div
            className={`transition-all duration-500 delay-300
              ${checkDone ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
          >
            <Check className="w-12 h-12 text-white" strokeWidth={3} />
          </div>
        </div>

        <div
          className={`transition-all duration-500 delay-500
            ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        >
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
            Uw bedrijf is klaar!
          </h2>
          <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
            Welkom bij Archos — uw digitale bouwbeheerplatform is volledig ingesteld en klaar voor gebruik.
          </p>
        </div>
      </div>

      {/* Feature highlights */}
      <div
        className={`grid grid-cols-2 gap-3 transition-all duration-500 delay-700
          ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        {FEATURE_ITEMS.map(({ Icon, label, description }) => (
          <div
            key={label}
            className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-white"
          >
            <div
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: '#fff7ed' }}
            >
              <Icon className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{label}</p>
              <p className="text-xs text-slate-500">{description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* What's next hint */}
      <div
        className={`rounded-xl p-4 border transition-all duration-500 delay-[900ms]
          ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        style={{ borderColor: 'var(--color-accent)', background: '#fff7ed' }}
      >
        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-accent)' }}>
          Wat nu?
        </p>
        <ul className="text-sm text-slate-600 space-y-1">
          <li className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
            Maak uw eerste project aan
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
            Voeg klanten en onderaannemers toe
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
            Maak uw eerste offerte op
          </li>
        </ul>
      </div>

      {/* CTA */}
      <div
        className={`transition-all duration-500 delay-[1100ms]
          ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        <Link
          to="/dashboard"
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-base font-semibold text-white
            hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
          style={{ background: 'var(--color-primary)' }}
        >
          Naar het dashboard
          <ArrowRight className="w-5 h-5" />
        </Link>

        <button
          type="button"
          onClick={onBack}
          className="w-full mt-3 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
        >
          Terug
        </button>
      </div>
    </div>
  )
}
