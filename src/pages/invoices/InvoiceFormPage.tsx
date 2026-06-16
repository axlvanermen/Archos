import { useEffect, useMemo } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { generateStructuredReference, formatStructuredReference } from '@/lib/belgianStructuredReference'
import { mockProjects, getClientById, mockContractorCompany, paymentTermsOptions } from './mockInvoiceData'

interface LineItemFormValues {
  description: string
  quantity: number
  unit: string
  unitPrice: number
  vatRate: number
}

interface InvoiceFormValues {
  projectId: string
  title: string
  issueDate: string
  dueDate: string
  paymentTerms: string
  notes: string
  bankAccount: string
  lineItems: LineItemFormValues[]
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

const inputClass = 'w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C4943A] focus:border-transparent placeholder:text-slate-400'

const vatRateOptions = [0, 6, 12, 21]

function round(n: number): number {
  return Math.round(n * 100) / 100
}

export default function InvoiceFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  // Stable structured reference for this (mock) invoice session — would be
  // generated server-side from a real invoice sequence number in production.
  const structuredReferenceSeed = useMemo(() => Date.now() % 10_000_000_000, [])
  const structuredReference = useMemo(
    () => generateStructuredReference(structuredReferenceSeed),
    [structuredReferenceSeed],
  )

  const { register, control, watch, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm<InvoiceFormValues>({
    defaultValues: {
      projectId: '',
      title: '',
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: '',
      paymentTerms: paymentTermsOptions[0],
      notes: '',
      bankAccount: mockContractorCompany.bankAccount,
      lineItems: [
        { description: '', quantity: 1, unit: 'vast bedrag', unitPrice: 0, vatRate: 21 },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'lineItems' })

  const projectId = watch('projectId')
  const lineItems = watch('lineItems')

  // Auto-fill client + bank account when a project is selected.
  useEffect(() => {
    if (!projectId) return
    const project = mockProjects.find((p) => p.id === projectId)
    if (!project) return
    setValue('bankAccount', mockContractorCompany.bankAccount)
  }, [projectId, setValue])

  const selectedProject = mockProjects.find((p) => p.id === projectId)
  const selectedClient = selectedProject ? getClientById(selectedProject.clientId) : undefined

  const computedLines = (lineItems ?? []).map((line) => {
    const qty = Number(line.quantity) || 0
    const unitPrice = Number(line.unitPrice) || 0
    const vatRate = Number(line.vatRate) || 0
    const totalExVat = round(qty * unitPrice)
    const totalIncVat = round(totalExVat * (1 + vatRate / 100))
    return { ...line, totalExVat, totalIncVat }
  })

  const subtotal = round(computedLines.reduce((sum, l) => sum + l.totalExVat, 0))
  const vatTotal = round(computedLines.reduce((sum, l) => sum + (l.totalIncVat - l.totalExVat), 0))
  const total = round(subtotal + vatTotal)

  const onSubmit = async (data: InvoiceFormValues) => {
    // Mock — no real persistence at this stage, just simulate a save and navigate back.
    console.log('Factuur opslaan:', { ...data, subtotal, vatTotal, total, structuredReference })
    navigate('/facturen')
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <button
          onClick={() => navigate('/facturen')}
          className="flex-shrink-0 mt-1 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-slate-500"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">{isEdit ? 'Factuur bewerken' : 'Nieuwe factuur'}</h1>
          <p className="text-sm text-slate-400 mt-0.5">Stel de factuurgegevens en factuurlijnen samen</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* General info */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="font-semibold text-[#0F172A] mb-4">Algemene gegevens</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Project *" error={errors.projectId?.message}>
              <select
                {...register('projectId', { required: 'Project is verplicht' })}
                className={inputClass}
              >
                <option value="">Selecteer een project…</option>
                {mockProjects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Klant">
              <input
                value={selectedClient?.name ?? ''}
                readOnly
                placeholder="Wordt ingevuld op basis van project"
                className={`${inputClass} bg-slate-50 text-slate-500`}
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Titel *" error={errors.title?.message}>
                <input
                  {...register('title', { required: 'Titel is verplicht' })}
                  placeholder="bv. Factuur - ruwbouw fase 1"
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Factuurdatum *" error={errors.issueDate?.message}>
              <input type="date" {...register('issueDate', { required: 'Factuurdatum is verplicht' })} className={inputClass} />
            </Field>

            <Field label="Vervaldatum" error={errors.dueDate?.message}>
              <input type="date" {...register('dueDate')} className={inputClass} />
            </Field>

            <Field label="Betalingsvoorwaarden">
              <select {...register('paymentTerms')} className={inputClass}>
                {paymentTermsOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </Field>

            <Field label="Rekeningnummer (IBAN)">
              <input {...register('bankAccount')} className={`${inputClass} font-mono`} />
            </Field>

            <Field label="Gestructureerde mededeling">
              <input
                value={formatStructuredReference(structuredReference.replace(/\D/g, ''))}
                readOnly
                className={`${inputClass} bg-slate-50 text-slate-500 font-mono`}
              />
            </Field>
          </div>
        </div>

        {/* Line items */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#0F172A]">Factuurlijnen</h3>
            <button
              type="button"
              onClick={() => append({ description: '', quantity: 1, unit: 'vast bedrag', unitPrice: 0, vatRate: 21 })}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Plus size={14} /> Lijn toevoegen
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100">
                  <th className="py-2 pr-3 font-medium w-[32%]">Omschrijving</th>
                  <th className="py-2 pr-3 font-medium w-[10%]">Aantal</th>
                  <th className="py-2 pr-3 font-medium w-[14%]">Eenheid</th>
                  <th className="py-2 pr-3 font-medium w-[16%]">Eenheidsprijs</th>
                  <th className="py-2 pr-3 font-medium w-[10%]">BTW%</th>
                  <th className="py-2 pr-3 font-medium w-[14%] text-right">Totaal excl.</th>
                  <th className="py-2 w-[4%]" />
                </tr>
              </thead>
              <tbody>
                {fields.map((field, idx) => (
                  <tr key={field.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-2 pr-3 align-top">
                      <input
                        {...register(`lineItems.${idx}.description`, { required: true })}
                        placeholder="bv. Ruwbouw fase 1"
                        className={inputClass}
                      />
                    </td>
                    <td className="py-2 pr-3 align-top">
                      <input
                        type="number"
                        step="0.01"
                        {...register(`lineItems.${idx}.quantity`, { valueAsNumber: true, min: 0 })}
                        className={inputClass}
                      />
                    </td>
                    <td className="py-2 pr-3 align-top">
                      <input
                        {...register(`lineItems.${idx}.unit`)}
                        placeholder="bv. m², u, vast bedrag"
                        className={inputClass}
                      />
                    </td>
                    <td className="py-2 pr-3 align-top">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">€</span>
                        <input
                          type="number"
                          step="0.01"
                          {...register(`lineItems.${idx}.unitPrice`, { valueAsNumber: true })}
                          className={`${inputClass} pl-7`}
                        />
                      </div>
                    </td>
                    <td className="py-2 pr-3 align-top">
                      <Controller
                        control={control}
                        name={`lineItems.${idx}.vatRate`}
                        render={({ field: ctrlField }) => (
                          <select
                            value={ctrlField.value}
                            onChange={(e) => ctrlField.onChange(Number(e.target.value))}
                            className={inputClass}
                          >
                            {vatRateOptions.map((rate) => (
                              <option key={rate} value={rate}>{rate}%</option>
                            ))}
                          </select>
                        )}
                      />
                    </td>
                    <td className="py-2 pr-3 align-top text-right font-medium text-[#0F172A] pt-3.5">
                      {formatCurrency(computedLines[idx]?.totalExVat ?? 0)}
                    </td>
                    <td className="py-2 align-top pt-2">
                      <button
                        type="button"
                        onClick={() => remove(idx)}
                        disabled={fields.length === 1}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        aria-label="Verwijder lijn"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals footer */}
          <div className="flex justify-end mt-4">
            <div className="w-full sm:w-64 space-y-1.5">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotaal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>BTW</span>
                <span>{formatCurrency(vatTotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#0F172A] pt-1.5 border-t border-slate-100">
                <span>Totaal</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <Field label="Opmerkingen">
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="Optionele opmerkingen op de factuur…"
              className={`${inputClass} resize-none`}
            />
          </Field>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/facturen')}
            className="px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Annuleren
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-semibold bg-[#0F172A] text-white rounded-xl hover:bg-slate-800 disabled:opacity-60 transition-colors cursor-pointer"
          >
            {isSubmitting ? 'Opslaan…' : 'Factuur opslaan'}
          </button>
        </div>
      </form>
    </div>
  )
}
