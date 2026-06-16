import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, CheckCircle2, Receipt, Landmark, Copy } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { InvoiceStatusBadge } from './invoiceStatus'
import { mockInvoices, getProjectById, getClientById, mockContractorCompany } from './mockInvoiceData'
import { InvoicePdfDocument } from './InvoicePdfDocument'
import { pdf } from '@react-pdf/renderer'
import { EmptyState } from '@/components/ui/EmptyState'

export default function InvoiceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [downloading, setDownloading] = useState(false)

  const invoice = mockInvoices.find((i) => i.id === id)

  // Local-only mock "mark as paid" toggle — there is no backend yet, so this
  // simply reflects in the UI for the duration of the session.
  const [markedPaid, setMarkedPaid] = useState(false)

  if (!invoice) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <EmptyState
          icon={<Receipt size={28} />}
          title="Factuur niet gevonden"
          description="Deze factuur bestaat niet (meer) of is verwijderd."
          action={{ label: 'Terug naar facturen', onClick: () => navigate('/facturen') }}
        />
      </div>
    )
  }

  const project = getProjectById(invoice.projectId)
  const client = getClientById(invoice.clientId)
  const displayStatus = markedPaid ? 'paid' : invoice.status
  const amountPaid = markedPaid ? invoice.total : invoice.amountPaid
  const dueAmount = invoice.total - amountPaid

  const fields = [
    { label: 'Referentie', value: invoice.reference },
    { label: 'Project', value: project?.name ?? '—' },
    { label: 'Klant', value: client?.name ?? '—' },
    { label: 'Factuurdatum', value: formatDate(invoice.issueDate) },
    { label: 'Vervaldatum', value: invoice.dueDate ? formatDate(invoice.dueDate) : '—' },
    { label: 'Betalingsvoorwaarden', value: invoice.paymentTerms ?? '—' },
    { label: 'Totaal', value: formatCurrency(invoice.total) },
    { label: 'Te betalen', value: formatCurrency(dueAmount) },
  ]

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const blob = await pdf(
        <InvoicePdfDocument
          data={{
            reference: invoice.reference,
            title: invoice.title,
            issueDate: invoice.issueDate,
            dueDate: invoice.dueDate,
            contractor: {
              name: mockContractorCompany.name,
              vatNumber: mockContractorCompany.vatNumber,
              address: mockContractorCompany.address,
            },
            client: client ? { name: client.name, vatNumber: client.vatNumber, address: client.address } : { name: '—', vatNumber: null, address: '—' },
            lineItems: invoice.lineItems,
            subtotal: invoice.subtotal,
            vatTotal: invoice.vatTotal,
            total: invoice.total,
            amountPaid,
            bankAccount: invoice.bankAccount,
            structuredReference: invoice.structuredReference,
            notes: invoice.notes,
          }}
        />,
      ).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `factuur-${invoice.reference}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text)
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Back + header */}
      <div className="flex items-start gap-4 mb-6">
        <button
          onClick={() => navigate('/facturen')}
          className="flex-shrink-0 mt-1 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-slate-500"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-[#0F172A]">{invoice.title}</h1>
            <InvoiceStatusBadge status={displayStatus} />
          </div>
          <p className="text-sm text-slate-400 font-mono">{invoice.reference} · {project?.name ?? '—'}</p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition-colors cursor-pointer"
          >
            <Download size={15} /> {downloading ? 'Bezig…' : 'Download PDF'}
          </button>
          {displayStatus !== 'paid' && displayStatus !== 'cancelled' && displayStatus !== 'credit_note' && (
            <button
              onClick={() => setMarkedPaid(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <CheckCircle2 size={15} /> Markeer als betaald
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="font-semibold text-[#0F172A] mb-4">Factuurgegevens</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {fields.map((f) => (
              <div key={f.label}>
                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">{f.label}</dt>
                <dd className="text-sm font-medium text-[#0F172A]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Line items */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="font-semibold text-[#0F172A] mb-4">Factuurlijnen</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100">
                  <th className="py-2 pr-3 font-medium">Omschrijving</th>
                  <th className="py-2 pr-3 font-medium text-right">Aantal</th>
                  <th className="py-2 pr-3 font-medium">Eenheid</th>
                  <th className="py-2 pr-3 font-medium text-right">Eenheidsprijs</th>
                  <th className="py-2 pr-3 font-medium text-right">BTW%</th>
                  <th className="py-2 pr-0 font-medium text-right">Totaal excl.</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lineItems.map((line) => (
                  <tr key={line.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-2.5 pr-3 text-[#0F172A]">{line.description}</td>
                    <td className="py-2.5 pr-3 text-right text-slate-600">{line.quantity}</td>
                    <td className="py-2.5 pr-3 text-slate-600">{line.unit}</td>
                    <td className="py-2.5 pr-3 text-right text-slate-600">{formatCurrency(line.unit_price)}</td>
                    <td className="py-2.5 pr-3 text-right text-slate-600">{line.vat_rate}%</td>
                    <td className="py-2.5 pr-0 text-right font-medium text-[#0F172A]">{formatCurrency(line.total_ex_vat)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-4">
            <div className="w-full sm:w-64 space-y-1.5">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotaal</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>BTW</span>
                <span>{formatCurrency(invoice.vatTotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#0F172A] pt-1.5 border-t border-slate-100">
                <span>Totaal</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Reeds betaald</span>
                <span>{formatCurrency(amountPaid)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#C4943A]">
                <span>Te betalen</span>
                <span>{formatCurrency(dueAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment info — prominent, this is what the client needs to pay */}
        <div className="md:col-span-2 bg-[#0F172A] rounded-2xl p-6 shadow-sm text-white">
          <div className="flex items-center gap-2 mb-4">
            <Landmark size={18} className="text-[#C4943A]" />
            <h3 className="font-semibold">Betalingsgegevens</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Rekeningnummer (IBAN)</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-mono font-semibold">{invoice.bankAccount ?? '—'}</p>
                {invoice.bankAccount && (
                  <button
                    onClick={() => handleCopy(invoice.bankAccount!)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Kopieer rekeningnummer"
                  >
                    <Copy size={14} />
                  </button>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Gestructureerde mededeling</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-mono font-semibold text-[#C4943A]">{invoice.structuredReference}</p>
                <button
                  onClick={() => handleCopy(invoice.structuredReference)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Kopieer mededeling"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            Gelieve bij betaling steeds de gestructureerde mededeling te vermelden.
          </p>
        </div>

        {invoice.notes && (
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h3 className="font-semibold text-[#0F172A] mb-2">Opmerkingen</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
