import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { mockTaskProjects, mockAssignees } from './mockTaskData'

const schema = z.object({
  title: z.string().min(2, 'Titel is verplicht'),
  project_id: z.string().min(1, 'Project is verplicht'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  assignee_id: z.string().optional(),
  due_date: z.string().optional(),
  estimated_hours: z.coerce.number().min(0, 'Moet positief zijn').optional(),
  tags: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface NewTaskModalProps {
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

export function NewTaskModal({ isOpen, onClose }: NewTaskModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { priority: 'medium' },
  })

  const onSubmit = async (data: FormData) => {
    const tags = data.tags
      ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : []
    console.log('Nieuwe taak:', { ...data, tags })
    reset()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nieuwe taak aanmaken"
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
            form="new-task-form"
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-semibold bg-[#0F172A] text-white rounded-xl hover:bg-slate-800 disabled:opacity-60 transition-colors cursor-pointer"
          >
            {isSubmitting ? 'Aanmaken…' : 'Taak aanmaken'}
          </button>
        </div>
      }
    >
      <form id="new-task-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Field label="Titel *" error={errors.title?.message}>
            <input {...register('title')} placeholder="bv. Funderingen uitgraven" className={inputClass} />
          </Field>
        </div>

        <Field label="Project *" error={errors.project_id?.message}>
          <select {...register('project_id')} className={inputClass} defaultValue="">
            <option value="" disabled>Kies een project…</option>
            {mockTaskProjects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </Field>

        <Field label="Toegewezen aan" error={errors.assignee_id?.message}>
          <select {...register('assignee_id')} className={inputClass} defaultValue="">
            <option value="">Niet toegewezen</option>
            {mockAssignees.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </Field>

        <Field label="Prioriteit" error={errors.priority?.message}>
          <select {...register('priority')} className={inputClass}>
            <option value="low">Laag</option>
            <option value="medium">Gemiddeld</option>
            <option value="high">Hoog</option>
            <option value="urgent">Urgent</option>
          </select>
        </Field>

        <Field label="Deadline" error={errors.due_date?.message}>
          <input type="date" {...register('due_date')} className={inputClass} />
        </Field>

        <Field label="Geschatte uren" error={errors.estimated_hours?.message}>
          <input type="number" step="0.5" {...register('estimated_hours')} placeholder="0" className={inputClass} />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Labels (komma-gescheiden)" error={errors.tags?.message}>
            <input {...register('tags')} placeholder="bv. urgent, veiligheid" className={inputClass} />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="Omschrijving" error={errors.description?.message}>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Korte omschrijving van de taak…"
              className={`${inputClass} resize-none`}
            />
          </Field>
        </div>
      </form>
    </Modal>
  )
}
