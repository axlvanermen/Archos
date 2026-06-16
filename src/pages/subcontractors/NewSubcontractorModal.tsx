import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'

const belgianVatRegex = /^BE0[0-9]{9}$/

export const specialtyOptions = [
  'Elektriciteit',
  'Loodgieterij',
  'Dakwerken',
  'Schilderwerken',
  'Metselwerk',
  'Andere',
] as const

const schema = z.object({
  name: z.string().min(2, 'Naam is verplicht'),
  vat_number: z
    .string()
    .optional()
    .refine((v) => !v || belgianVatRegex.test(v), 'Ongeldig BTW-nummer (formaat BE0123456789)'),
  specialty: z.string().optional(),
  contact_person: z.string().optional(),
  email: z.string().optional().refine((v) => !v || z.string().email().safeParse(v).success, 'Ongeldig e-mailadres'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  hourly_rate: z.coerce.number().min(0, 'Uurtarief moet positief zijn').optional(),
  vca_expiry_date: z.string().optional(),
  rsz_attestation_expiry_date: z.string().optional(),
  insurance_expiry_date: z.string().optional(),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface NewSubcontractorModalProps {
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

export function NewSubcontractorModal({ isOpen, onClose }: NewSubcontractorModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    console.log('Nieuwe onderaannemer:', data)
    reset()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nieuwe onderaannemer aanmaken"
      size="lg"
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
            form="new-subcontractor-form"
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-semibold bg-[#0F172A] text-white rounded-xl hover:bg-slate-800 disabled:opacity-60 transition-colors cursor-pointer"
          >
            {isSubmitting ? 'Aanmaken…' : 'Onderaannemer aanmaken'}
          </button>
        </div>
      }
    >
      <form id="new-subcontractor-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Naam *" error={errors.name?.message}>
          <input {...register('name')} placeholder="bv. Elektro Peeters BVBA" className={inputClass} />
        </Field>

        <Field label="BTW-nummer" error={errors.vat_number?.message}>
          <input {...register('vat_number')} placeholder="bv. BE0123456789" className={inputClass} />
        </Field>

        <Field label="Specialiteit" error={errors.specialty?.message}>
          <select {...register('specialty')} className={inputClass}>
            <option value="">Selecteer specialiteit…</option>
            {specialtyOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>

        <Field label="Contactpersoon" error={errors.contact_person?.message}>
          <input {...register('contact_person')} placeholder="bv. Jan Peeters" className={inputClass} />
        </Field>

        <Field label="E-mailadres" error={errors.email?.message}>
          <input {...register('email')} placeholder="bv. info@elektropeeters.be" className={inputClass} />
        </Field>

        <Field label="Telefoonnummer" error={errors.phone?.message}>
          <input {...register('phone')} placeholder="bv. 0470 12 34 56" className={inputClass} />
        </Field>

        <Field label="Adres" error={errors.address?.message}>
          <input {...register('address')} placeholder="bv. Industrielaan 12" className={inputClass} />
        </Field>

        <Field label="Postcode" error={errors.postal_code?.message}>
          <input {...register('postal_code')} placeholder="bv. 3500" className={inputClass} />
        </Field>

        <Field label="Stad" error={errors.city?.message}>
          <input {...register('city')} placeholder="bv. Hasselt" className={inputClass} />
        </Field>

        <Field label="Uurtarief (excl. BTW)" error={errors.hourly_rate?.message}>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">€</span>
            <input type="number" step="0.01" {...register('hourly_rate')} placeholder="0" className={`${inputClass} pl-7`} />
          </div>
        </Field>

        <Field label="VCA-attest vervaldatum" error={errors.vca_expiry_date?.message}>
          <input type="date" {...register('vca_expiry_date')} className={inputClass} />
        </Field>

        <Field label="RSZ-attest vervaldatum" error={errors.rsz_attestation_expiry_date?.message}>
          <input type="date" {...register('rsz_attestation_expiry_date')} className={inputClass} />
        </Field>

        <Field label="Verzekering vervaldatum" error={errors.insurance_expiry_date?.message}>
          <input type="date" {...register('insurance_expiry_date')} className={inputClass} />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Notities" error={errors.notes?.message}>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="Interne notities over deze onderaannemer…"
              className={`${inputClass} resize-none`}
            />
          </Field>
        </div>
      </form>
    </Modal>
  )
}
