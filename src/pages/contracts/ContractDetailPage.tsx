import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Download, Check } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ContractStatusBadge } from './contractStatus'
import { mockContracts, getProjectById, getClientById, mockContractorCompany } from './mockContractData'
import { ContractPdfDocument } from './ContractPdfDocument'
import { pdf } from '@react-pdf/renderer'
import { EmptyState } from '@/components/ui/EmptyState'
import { FileSignature } from 'lucide-react'

export default function ContractDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [downloading, setDownloading] = useState(false)

  const contract = mockContracts.find((c) => c.id === id)

  if (!contract) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <EmptyState
          icon={<FileSignature size={28} />}
          title="Contract niet gevonden"
          description="Dit contract bestaat niet (meer) of is verwijderd."
          action={{ label: 'Terug naar contracten', onClick: () => navigate('/contracten') }}
        />
      </div>
    )
  }

  const project = getProjectById(contract.projectId)
  const client = getClientById(contract.clientId)
  const selectedClauses = contract.clauses.filter((c) => c.selected)

  const fields = [
    { label: 'Referentie', value: contract.reference },
    { label: 'Project', value: project?.name ?? '—' },
    { label: 'Opdrachtgever', value: client?.name ?? '—' },
    { label: 'Aannemingssom', value: formatCurrency(contract.contractValue) },
    { label: 'Betalingsvoorwaarden', value: contract.paymentTerms },
    { label: 'Startdatum', value: formatDate(contract.startDate) },
    { label: 'Einddatum', value: formatDate(contract.endDate) },
    { label: 'Ondertekend op', value: contract.signDate ? formatDate(contract.signDate) : 'Nog niet ondertekend' },
  ]

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const blob = await pdf(
        <ContractPdfDocument
          data={{
            reference: contract.reference,
            title: contract.title,
            description: contract.description,
            contractValue: contract.contractValue,
            paymentTerms: contract.paymentTerms,
            startDate: contract.startDate,
            endDate: contract.endDate,
            signDate: contract.signDate ?? undefined,
            contractor: mockContractorCompany,
            client: client ? { name: client.name, vatNumber: client.vatNumber, address: client.address } : { name: '—', vatNumber: null, address: '—' },
            project: project ? { name: project.name, address: project.address } : { name: '—', address: '—' },
            clauses: contract.clauses,
          }}
        />,
      ).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `contract-${contract.reference}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Back + header */}
      <div className="flex items-start gap-4 mb-6">
        <button
          onClick={() => navigate('/contracten')}
          className="flex-shrink-0 mt-1 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-slate-500"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-[#0F172A]">{contract.title}</h1>
            <ContractStatusBadge status={contract.status} />
          </div>
          <p className="text-sm text-slate-400 font-mono">{contract.reference} · {project?.name ?? '—'}</p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition-colors cursor-pointer"
          >
            <Download size={15} /> {downloading ? 'Bezig…' : 'Download PDF'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
            <Edit size={15} /> Bewerken
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="font-semibold text-[#0F172A] mb-4">Contractgegevens</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {fields.map((f) => (
              <div key={f.label}>
                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">{f.label}</dt>
                <dd className="text-sm font-medium text-[#0F172A]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="font-semibold text-[#0F172A] mb-2">Omschrijving werken</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{contract.description}</p>
        </div>

        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="font-semibold text-[#0F172A] mb-4">Clausules ({selectedClauses.length})</h3>
          <div className="space-y-4">
            {selectedClauses.map((clause) => (
              <div key={clause.id} className="pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <Check size={14} className="text-emerald-500 flex-shrink-0" />
                  <h4 className="text-sm font-semibold text-[#0F172A]">{clause.title}</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed pl-5">{clause.text}</p>
              </div>
            ))}
            {selectedClauses.length === 0 && (
              <p className="text-sm text-slate-400">Geen clausules geselecteerd voor dit contract.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
