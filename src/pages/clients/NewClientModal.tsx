import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Modal } from '@/components/ui/Modal'
import { useCreateClient } from '@/hooks/useClients'

const belgianVatRegex = /^BE0[0-9]{9}$/

const schema = z.object({
  name: z.string().min(2, 'Naam is verplicht'),
  vat_number: z
    .string()
    .optional()
    .refine((v) => !v || belgianVatRegex.test(v), 'Ongeldig BTW-nummer (formaat BE0123456789)'),
  contact_person: z.string().optional(),
  email: z.string().optional().refine((v) => !v || z.string().email().safeParse(v).success, 'Ongeldig e-mailadres'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface NewClientModalProps {
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

export function NewClientModal({ isOpen, onClose }: NewClientModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  const createClient = useCreateClient()

  const onSubmit = async (data: FormData) => {
    try {
      await createClient.mutateAsync({
        name: data.name,
        vat_number: data.vat_number || null,
        contact_person: data.contact_person || null,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        city: data.city || null,
        postal_code: data.postal_code || null,
        notes: data.notes || null,
      })
      toast.success('Klant aangemaakt', { description: `${data.name} is toegevoegd.` })
      reset()
      onClose()
    } catch (err) {
      toast.error('Aanmaken mislukt', { description: err instanceof Error ? err.message : 'Onbekende fout' })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nieuwe klant aanmaken"
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
            form="new-client-form"
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-semibold bg-[#0F172A] text-white rounded-xl hover:bg-slate-800 disabled:opacity-60 transition-colors cursor-pointer"
          >
            {isSubmitting ? 'Aanmaken…' : 'Klant aanmaken'}
          </button>
        </div>
      }
    >
      <form id="new-client-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Naam *" error={errors.name?.message}>
          <input {...register('name')} placeholder="bv. Familie De Groote" className={inputClass} />
        </Field>

        <Field label="BTW-nummer" error={errors.vat_number?.message}>
          <input {...register('vat_number')} placeholder="bv. BE0123456789" className={inputClass} />
        </Field>

        <Field label="Contactpersoon" error={errors.contact_person?.message}>
          <input {...register('contact_person')} placeholder="bv. Jan De Groote" className={inputClass} />
        </Field>

        <Field label="E-mailadres" error={errors.email?.message}>
          <input {...register('email')} placeholder="bv. info@klant.be" className={inputClass} />
        </Field>

        <Field label="Telefoonnummer" error={errors.phone?.message}>
          <input {...register('phone')} placeholder="bv. 0470 12 34 56" className={inputClass} />
        </Field>

        <Field label="Postcode" error={errors.postal_code?.message}>
          <input {...register('postal_code')} placeholder="bv. 8300" className={inputClass} />
        </Field>

        <Field label="Adres" error={errors.address?.message}>
          <input {...register('address')} placeholder="bv. Zeedijk 145" className={inputClass} />
        </Field>

        <Field label="Stad" error={errors.city?.message}>
          <input {...register('city')} placeholder="bv. Knokke-Heist" className={inputClass} />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Notities" error={errors.notes?.message}>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="Interne notities over deze klant…"
              className={`${inputClass} resize-none`}
            />
          </Field>
        </div>
      </form>
    </Modal>
  )
}
