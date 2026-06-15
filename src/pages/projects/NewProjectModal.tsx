import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'

const schema = z.object({
  naam: z.string().min(2, 'Naam is verplicht'),
  klant: z.string().min(2, 'Klant is verplicht'),
  adres: z.string().min(5, 'Adres is verplicht'),
  omschrijving: z.string().optional(),
  startdatum: z.string().min(1, 'Startdatum is verplicht'),
  einddatum: z.string().min(1, 'Einddatum is verplicht'),
  budget: z.coerce.number().min(0, 'Budget moet positief zijn'),
  verantwoordelijke: z.string().min(2, 'Verantwoordelijke is verplicht'),
})

type FormData = z.infer<typeof schema>

interface NewProjectModalProps {
  isOpen: boolean
  onClose: () => void
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

export function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    console.log('Nieuw project:', data)
    reset()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nieuw project aanmaken"
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Annuleren
          </button>
          <button
            type="submit"
            form="new-project-form"
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-semibold bg-[#0F172A] text-white rounded-xl hover:bg-slate-800 disabled:opacity-60 transition-colors cursor-pointer"
          >
            {isSubmitting ? 'Aanmaken…' : 'Project aanmaken'}
          </button>
        </div>
      }
    >
      <form id="new-project-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Projectnaam *" error={errors.naam?.message}>
          <input {...register('naam')} placeholder="bv. Villa Knokke" className={inputClass} />
        </Field>

        <Field label="Klant *" error={errors.klant?.message}>
          <input {...register('klant')} placeholder="bv. Familie De Groote" className={inputClass} />
        </Field>

        <Field label="Werfadres *" error={errors.adres?.message}>
          <input {...register('adres')} placeholder="bv. Zeedijk 145, 8300 Knokke" className={inputClass} />
        </Field>

        <Field label="Verantwoordelijke *" error={errors.verantwoordelijke?.message}>
          <input {...register('verantwoordelijke')} placeholder="bv. Jan Peeters" className={inputClass} />
        </Field>

        <Field label="Startdatum *" error={errors.startdatum?.message}>
          <input type="date" {...register('startdatum')} className={inputClass} />
        </Field>

        <Field label="Einddatum *" error={errors.einddatum?.message}>
          <input type="date" {...register('einddatum')} className={inputClass} />
        </Field>

        <Field label="Budget (excl. BTW)" error={errors.budget?.message}>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">€</span>
            <input type="number" {...register('budget')} placeholder="0" className={`${inputClass} pl-7`} />
          </div>
        </Field>

        <div className="sm:col-span-2">
          <Field label="Omschrijving werken" error={errors.omschrijving?.message}>
            <textarea
              {...register('omschrijving')}
              rows={3}
              placeholder="Korte omschrijving van de uit te voeren werken…"
              className={`${inputClass} resize-none`}
            />
          </Field>
        </div>
      </form>
    </Modal>
  )
}
