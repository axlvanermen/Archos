import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check, FileSignature, Download, ArrowLeft, ArrowRight, Info } from 'lucide-react'
import { pdf } from '@react-pdf/renderer'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ContractPdfDocument, type ContractClause } from './ContractPdfDocument'
import {
  mockContractorCompany,
  mockProjects,
  getProjectById,
  getClientById,
  defaultClauses,
  paymentTermsOptions,
} from './mockContractData'

const STEPS = [
  { id: 1, label: 'Project & Partijen' },
  { id: 2, label: 'Werk & Vergoeding' },
  { id: 3, label: 'Clausules' },
  { id: 4, label: 'Overzicht' },
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

// ─── Step 1 schema ──────────────────────────────────────────────────────────
const step1Schema = z.object({
  projectId: z.string().min(1, 'Kies een project'),
})
type Step1Data = z.infer<typeof step1Schema>

// ─── Step 2 schema ──────────────────────────────────────────────────────────
const step2Schema = z.object({
  title: z.string().min(3, 'Titel is verplicht'),
  description: z.string().min(10, 'Omschrijving is verplicht (min. 10 tekens)'),
  contractValue: z.coerce.number().min(1, 'Aannemingssom moet groter zijn dan 0'),
  paymentTerms: z.string().min(1, 'Kies betalingsvoorwaarden'),
  customPaymentTerms: z.string().optional(),
  startDate: z.string().min(1, 'Startdatum is verplicht'),
  endDate: z.string().min(1, 'Einddatum is verplicht'),
}).refine((data) => data.paymentTerms !== 'Aangepast' || (data.customPaymentTerms ?? '').trim().length > 0, {
  message: 'Vul de aangepaste betalingsvoorwaarden in',
  path: ['customPaymentTerms'],
})
type Step2Data = z.infer<typeof step2Schema>

interface WizardData extends Step1Data, Omit<Step2Data, 'customPaymentTerms'> {
  customPaymentTerms: string
  clauses: ContractClause[]
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100
  return (
    <div className="bg-white border-b border-slate-100 px-6 pt-5 pb-4 rounded-t-2xl">
      <div className="flex items-center justify-between mb-3 max-w-xl mx-auto">
        {STEPS.map((step) => {
          const isDone = step.id < currentStep
          const isActive = step.id === currentStep
          return (
            <div key={step.id} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${isDone ? 'text-white' : isActive ? 'text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}
                style={isDone ? { background: 'var(--color-accent)' } : isActive ? { background: 'var(--color-primary)' } : {}}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : step.id}
              </div>
              <span className={`text-xs font-medium transition-colors hidden sm:block ${isActive ? 'text-slate-800' : isDone ? 'text-slate-400' : 'text-slate-300'}`}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
      <div className="relative max-w-xl mx-auto">
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 100%)' }}
          />
        </div>
      </div>
    </div>
  )
}

export default function ContractWizardPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [wizardData, setWizardData] = useState<WizardData>({
    projectId: '',
    title: '',
    description: '',
    contractValue: 0,
    paymentTerms: '',
    customPaymentTerms: '',
    startDate: '',
    endDate: '',
    clauses: defaultClauses.map((c) => ({ ...c })),
  })
  const [generated, setGenerated] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [reference] = useState(() => `CONTR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`)

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length))
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1))

  const project = getProjectById(wizardData.projectId)
  const client = project ? getClientById(project.clientId) : undefined

  const effectivePaymentTerms = wizardData.paymentTerms === 'Aangepast' ? wizardData.customPaymentTerms : wizardData.paymentTerms

  const pdfData = useMemo(() => ({
    reference,
    title: wizardData.title,
    description: wizardData.description,
    contractValue: wizardData.contractValue,
    paymentTerms: effectivePaymentTerms,
    startDate: wizardData.startDate,
    endDate: wizardData.endDate,
    contractor: mockContractorCompany,
    client: client ? { name: client.name, vatNumber: client.vatNumber, address: client.address } : { name: '—', vatNumber: null, address: '—' },
    project: project ? { name: project.name, address: project.address } : { name: '—', address: '—' },
    clauses: wizardData.clauses,
  }), [reference, wizardData, client, project, effectivePaymentTerms])

  const handleGeneratePdf = async () => {
    setGenerating(true)
    try {
      const blob = await pdf(<ContractPdfDocument data={pdfData} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `contract-${reference}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      setGenerated(true)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/contracten')}
          className="flex-shrink-0 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-slate-500"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Nieuw contract</h1>
          <p className="text-sm text-slate-400">Stap {currentStep} van {STEPS.length} · {STEPS[currentStep - 1].label}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
        <StepIndicator currentStep={currentStep} />
        <div key={currentStep} className="p-6 sm:p-8 animate-slide-up">
          {currentStep === 1 && (
            <StepProjectPartijen
              wizardData={wizardData}
              setWizardData={setWizardData}
              onNext={goNext}
            />
          )}
          {currentStep === 2 && (
            <StepWerkVergoeding
              wizardData={wizardData}
              setWizardData={setWizardData}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {currentStep === 3 && (
            <StepClausules
              wizardData={wizardData}
              setWizardData={setWizardData}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {currentStep === 4 && (
            <StepOverzicht
              wizardData={wizardData}
              reference={reference}
              project={project}
              client={client}
              effectivePaymentTerms={effectivePaymentTerms ?? ''}
              onBack={goBack}
              onGenerate={handleGeneratePdf}
              generating={generating}
              generated={generated}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Step 1: Project & Partijen ────────────────────────────────────────────
function StepProjectPartijen({
  wizardData,
  setWizardData,
  onNext,
}: {
  wizardData: WizardData
  setWizardData: React.Dispatch<React.SetStateAction<WizardData>>
  onNext: () => void
}) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: { projectId: wizardData.projectId },
  })

  const selectedProjectId = watch('projectId')
  const project = getProjectById(selectedProjectId)
  const client = project ? getClientById(project.clientId) : undefined

  const onSubmit = (data: Step1Data) => {
    setWizardData((prev) => ({ ...prev, projectId: data.projectId }))
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#0F172A] mb-1">Project & Partijen</h2>
        <p className="text-sm text-slate-500">Kies het project waarvoor dit contract wordt opgemaakt.</p>
      </div>

      <Field label="Project *" error={errors.projectId?.message}>
        <select {...register('projectId')} className={inputClass}>
          <option value="">Selecteer een project…</option>
          {mockProjects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </Field>

      {/* Contractor + client info are read-only: pulled from the company profile
          and the project's linked client record, never typed by the user here. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-[#C4943A] uppercase tracking-wide mb-2">Aannemer</p>
          <p className="text-sm font-semibold text-[#0F172A]">{mockContractorCompany.name}</p>
          <p className="text-xs text-slate-500 mt-1">BTW: {mockContractorCompany.vatNumber}</p>
          <p className="text-xs text-slate-500">{mockContractorCompany.address}</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-[#C4943A] uppercase tracking-wide mb-2">Opdrachtgever</p>
          {client ? (
            <>
              <p className="text-sm font-semibold text-[#0F172A]">{client.name}</p>
              <p className="text-xs text-slate-500 mt-1">BTW: {client.vatNumber ?? 'n.v.t.'}</p>
              <p className="text-xs text-slate-500">{client.address}</p>
            </>
          ) : (
            <p className="text-xs text-slate-400">Kies eerst een project</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-[#0F172A] text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer">
          Volgende <ArrowRight size={15} />
        </button>
      </div>
    </form>
  )
}

// ─── Step 2: Werk & Vergoeding ──────────────────────────────────────────────
function StepWerkVergoeding({
  wizardData,
  setWizardData,
  onNext,
  onBack,
}: {
  wizardData: WizardData
  setWizardData: React.Dispatch<React.SetStateAction<WizardData>>
  onNext: () => void
  onBack: () => void
}) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      title: wizardData.title,
      description: wizardData.description,
      contractValue: wizardData.contractValue,
      paymentTerms: wizardData.paymentTerms,
      customPaymentTerms: wizardData.customPaymentTerms,
      startDate: wizardData.startDate,
      endDate: wizardData.endDate,
    },
  })

  const paymentTerms = watch('paymentTerms')

  const onSubmit = (data: Step2Data) => {
    setWizardData((prev) => ({ ...prev, ...data, customPaymentTerms: data.customPaymentTerms ?? '' }))
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-[#0F172A] mb-1">Werk & Vergoeding</h2>
        <p className="text-sm text-slate-500">Beschrijf de werken en de financiële afspraken.</p>
      </div>

      <Field label="Titel van het contract *" error={errors.title?.message}>
        <input {...register('title')} placeholder="bv. Aannemingsovereenkomst nieuwbouw villa" className={inputClass} />
      </Field>

      <Field label="Omschrijving van de werken *" error={errors.description?.message}>
        <textarea
          {...register('description')}
          rows={4}
          placeholder="Beschrijf de scope van de uit te voeren werken…"
          className={`${inputClass} resize-none`}
        />
      </Field>

      <Field label="Aannemingssom (excl. BTW) *" error={errors.contractValue?.message}>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">€</span>
          <input type="number" step="0.01" {...register('contractValue')} placeholder="0" className={`${inputClass} pl-7`} />
        </div>
      </Field>

      <Field label="Betalingsvoorwaarden *" error={errors.paymentTerms?.message}>
        <select {...register('paymentTerms')} className={inputClass}>
          <option value="">Selecteer…</option>
          {paymentTermsOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </Field>

      {paymentTerms === 'Aangepast' && (
        <Field label="Aangepaste betalingsvoorwaarden *" error={errors.customPaymentTerms?.message}>
          <input {...register('customPaymentTerms')} placeholder="bv. 30% voorschot, 40% bij ruwbouw, 30% bij oplevering" className={inputClass} />
        </Field>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Startdatum *" error={errors.startDate?.message}>
          <input type="date" {...register('startDate')} className={inputClass} />
        </Field>
        <Field label="Einddatum *" error={errors.endDate?.message}>
          <input type="date" {...register('endDate')} className={inputClass} />
        </Field>
      </div>

      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
          <ArrowLeft size={15} /> Vorige
        </button>
        <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-[#0F172A] text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer">
          Volgende <ArrowRight size={15} />
        </button>
      </div>
    </form>
  )
}

// ─── Step 3: Clausules ──────────────────────────────────────────────────────
function StepClausules({
  wizardData,
  setWizardData,
  onNext,
  onBack,
}: {
  wizardData: WizardData
  setWizardData: React.Dispatch<React.SetStateAction<WizardData>>
  onNext: () => void
  onBack: () => void
}) {
  const [clauses, setClauses] = useState<ContractClause[]>(wizardData.clauses)

  const toggleClause = (id: string) => {
    setClauses((prev) => prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c)))
  }

  const updateClauseText = (id: string, text: string) => {
    setClauses((prev) => prev.map((c) => (c.id === id ? { ...c, text } : c)))
  }

  const handleNext = () => {
    setWizardData((prev) => ({ ...prev, clauses }))
    onNext()
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-[#0F172A] mb-1">Clausules</h2>
        <p className="text-sm text-slate-500">Selecteer en bewerk de standaardbepalingen voor dit contract.</p>
      </div>

      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-100">
        <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-800">
          Deze tekstvoorstellen zijn algemene boilerplate en vormen geen juridisch advies. Controleer met een jurist of boekhouder of deze voorwaarden voldoen aan uw situatie.
        </p>
      </div>

      <div className="space-y-3">
        {clauses.map((clause) => (
          <div key={clause.id} className="border border-slate-200 rounded-xl p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={clause.selected}
                onChange={() => toggleClause(clause.id)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#C4943A] focus:ring-[#C4943A]"
              />
              <span className="text-sm font-semibold text-[#0F172A]">{clause.title}</span>
            </label>
            {clause.selected && (
              <textarea
                value={clause.text}
                onChange={(e) => updateClauseText(clause.id, e.target.value)}
                rows={3}
                className={`${inputClass} mt-3 resize-none text-xs leading-relaxed`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
          <ArrowLeft size={15} /> Vorige
        </button>
        <button type="button" onClick={handleNext} className="flex items-center gap-2 px-5 py-2.5 bg-[#0F172A] text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer">
          Volgende <ArrowRight size={15} />
        </button>
      </div>
    </div>
  )
}

// ─── Step 4: Overzicht & Genereren ──────────────────────────────────────────
function StepOverzicht({
  wizardData,
  reference,
  project,
  client,
  effectivePaymentTerms,
  onBack,
  onGenerate,
  generating,
  generated,
}: {
  wizardData: WizardData
  reference: string
  project: ReturnType<typeof getProjectById>
  client: ReturnType<typeof getClientById>
  effectivePaymentTerms: string
  onBack: () => void
  onGenerate: () => void
  generating: boolean
  generated: boolean
}) {
  const navigate = useNavigate()
  const selectedClauses = wizardData.clauses.filter((c) => c.selected)

  if (generated) {
    return (
      <div className="flex flex-col items-center text-center py-10">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-5 text-emerald-600">
          <Check size={28} />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1.5">Contract gegenereerd</h3>
        <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-6">
          De PDF van contract-{reference}.pdf is gedownload naar uw apparaat.
        </p>
        <button
          onClick={() => navigate('/contracten')}
          className="px-5 py-2.5 bg-[#0F172A] text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Terug naar contracten
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-[#0F172A] mb-1">Overzicht & Genereren</h2>
        <p className="text-sm text-slate-500">Controleer de gegevens voor u het contract genereert.</p>
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Referentie</span>
          <span className="font-mono font-medium text-[#0F172A]">{reference}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Project</span>
          <span className="font-medium text-[#0F172A]">{project?.name ?? '—'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Opdrachtgever</span>
          <span className="font-medium text-[#0F172A]">{client?.name ?? '—'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Titel</span>
          <span className="font-medium text-[#0F172A] text-right">{wizardData.title}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Aannemingssom</span>
          <span className="font-medium text-[#0F172A]">{formatCurrency(wizardData.contractValue)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Betalingsvoorwaarden</span>
          <span className="font-medium text-[#0F172A] text-right">{effectivePaymentTerms}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Looptijd</span>
          <span className="font-medium text-[#0F172A]">{formatDate(wizardData.startDate)} → {formatDate(wizardData.endDate)}</span>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Omschrijving werken</p>
        <p className="text-sm text-slate-700 leading-relaxed">{wizardData.description}</p>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Geselecteerde clausules ({selectedClauses.length})</p>
        <ul className="space-y-1.5">
          {selectedClauses.map((c) => (
            <li key={c.id} className="flex items-center gap-2 text-sm text-slate-700">
              <Check size={14} className="text-emerald-500 flex-shrink-0" />
              {c.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
          <ArrowLeft size={15} /> Vorige
        </button>
        <button
          type="button"
          onClick={onGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#C4943A] text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-60 transition-all cursor-pointer"
        >
          {generating ? (
            <>Genereren…</>
          ) : (
            <>
              <FileSignature size={15} /> PDF genereren
              <Download size={15} />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
