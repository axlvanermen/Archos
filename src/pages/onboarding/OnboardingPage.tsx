import { useState } from 'react'
import { Building2, Check } from 'lucide-react'
import StepBedrijfsInfo from './steps/StepBedrijfsInfo'
import StepBranding from './steps/StepBranding'
import StepBedrijfsType from './steps/StepBedrijfsType'
import StepMedewerkers from './steps/StepMedewerkers'
import StepKlaar from './steps/StepKlaar'

const STEPS = [
  { id: 1, label: 'Bedrijf' },
  { id: 2, label: 'Branding' },
  { id: 3, label: 'Type' },
  { id: 4, label: 'Team' },
  { id: 5, label: 'Klaar' },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length))
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1))

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepBedrijfsInfo onNext={goNext} onBack={goBack} />
      case 2:
        return <StepBranding onNext={goNext} onBack={goBack} />
      case 3:
        return <StepBedrijfsType onNext={goNext} onBack={goBack} />
      case 4:
        return <StepMedewerkers onNext={goNext} onBack={goBack} />
      case 5:
        return <StepKlaar onNext={goNext} onBack={goBack} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--color-primary)' }}
          >
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight" style={{ color: 'var(--color-primary)' }}>
            Archos
          </span>
        </div>
        <span className="text-sm text-slate-500 font-medium">
          Stap {currentStep} van {STEPS.length}
        </span>
      </header>

      {/* Progress section */}
      <div className="bg-white border-b border-slate-100 px-6 pt-5 pb-4">
        {/* Step labels */}
        <div className="flex items-center justify-between mb-3 max-w-xl mx-auto">
          {STEPS.map((step) => {
            const isDone = step.id < currentStep
            const isActive = step.id === currentStep
            return (
              <div key={step.id} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                    ${isDone
                      ? 'text-white'
                      : isActive
                        ? 'text-white shadow-md'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  style={
                    isDone
                      ? { background: 'var(--color-accent)' }
                      : isActive
                        ? { background: 'var(--color-primary)' }
                        : {}
                  }
                >
                  {isDone ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`text-xs font-medium transition-colors hidden sm:block
                    ${isActive ? 'text-slate-800' : isDone ? 'text-slate-400' : 'text-slate-300'}`}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Progress bar */}
        <div className="relative max-w-xl mx-auto">
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 100%)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          {/* Step card */}
          <div
            key={currentStep}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-slide-up"
          >
            {renderStep()}
          </div>

          {/* Footer note */}
          {currentStep < STEPS.length && (
            <p className="text-center mt-6 text-xs text-slate-400">
              Uw gegevens worden veilig opgeslagen en zijn alleen zichtbaar voor uw team.
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
