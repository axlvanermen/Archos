import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { formatStructuredReference } from '@/lib/belgianStructuredReference'

export interface InvoicePdfLineItem {
  description: string
  quantity: number
  unit: string
  unit_price: number
  vat_rate: number
  total_ex_vat: number
  total_inc_vat: number
}

// Minimal data the PDF needs — decoupled from the full Invoice DB type so the
// form can pass in-progress (not-yet-persisted) data too.
export interface InvoicePdfData {
  reference: string
  title: string
  issueDate: string
  dueDate: string | null
  contractor: {
    name: string
    vatNumber: string
    address: string
  }
  client: {
    name: string
    vatNumber: string | null
    address: string
  }
  lineItems: InvoicePdfLineItem[]
  subtotal: number
  vatTotal: number
  total: number
  amountPaid: number
  bankAccount: string | null
  structuredReference: string | null
  notes?: string | null
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 48,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#0F172A',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 11,
    fontWeight: 700,
    color: '#0F172A',
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 4,
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 9,
    textAlign: 'center',
    color: '#64748B',
    marginBottom: 20,
  },
  hr: {
    borderBottomWidth: 1,
    borderBottomColor: '#C4943A',
    marginBottom: 16,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#0F172A',
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: '#CBD5E1',
  },
  partiesRow: {
    flexDirection: 'row',
    gap: 16,
  },
  partyBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 4,
  },
  partyLabel: {
    fontSize: 8,
    color: '#C4943A',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  partyName: {
    fontSize: 10.5,
    fontWeight: 700,
    marginBottom: 2,
  },
  partyLine: {
    fontSize: 9,
    color: '#334155',
    marginBottom: 1.5,
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  fieldLabel: {
    width: 140,
    fontSize: 9,
    color: '#64748B',
  },
  fieldValue: {
    flex: 1,
    fontSize: 9.5,
    color: '#0F172A',
    fontWeight: 700,
  },
  table: {
    marginTop: 4,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 3,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 700,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E2E8F0',
  },
  tableCell: {
    fontSize: 9,
    color: '#334155',
  },
  colDescription: { flex: 3 },
  colQty: { flex: 1, textAlign: 'right' },
  colUnit: { flex: 1, textAlign: 'center' },
  colUnitPrice: { flex: 1.2, textAlign: 'right' },
  colVat: { flex: 0.8, textAlign: 'right' },
  colTotal: { flex: 1.3, textAlign: 'right' },
  totalsBlock: {
    marginTop: 10,
    alignSelf: 'flex-end',
    width: 260,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  totalsLabel: {
    fontSize: 9,
    color: '#64748B',
  },
  totalsValue: {
    fontSize: 9.5,
    color: '#0F172A',
    fontWeight: 700,
  },
  totalsDivider: {
    borderBottomWidth: 0.75,
    borderBottomColor: '#CBD5E1',
    marginVertical: 4,
  },
  totalsGrandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  totalsGrandLabel: {
    fontSize: 10.5,
    fontWeight: 700,
    color: '#0F172A',
  },
  totalsGrandValue: {
    fontSize: 11,
    fontWeight: 700,
    color: '#0F172A',
  },
  dueBox: {
    marginTop: 6,
    backgroundColor: '#FEF3E2',
    borderRadius: 4,
    padding: 8,
  },
  dueLabel: {
    fontSize: 9.5,
    fontWeight: 700,
    color: '#92400E',
  },
  dueValue: {
    fontSize: 13,
    fontWeight: 700,
    color: '#92400E',
  },
  paymentBox: {
    marginTop: 24,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  paymentTitle: {
    fontSize: 10.5,
    fontWeight: 700,
    color: '#0F172A',
    marginBottom: 8,
  },
  paymentRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  paymentLabel: {
    width: 150,
    fontSize: 9,
    color: '#64748B',
  },
  paymentValue: {
    flex: 1,
    fontSize: 11,
    color: '#0F172A',
    fontWeight: 700,
    fontFamily: 'Courier',
  },
  paymentNote: {
    fontSize: 8.5,
    color: '#64748B',
    marginTop: 6,
    fontStyle: 'italic',
  },
  notesSection: {
    marginTop: 14,
  },
  notesText: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 48,
    right: 48,
    fontSize: 7.5,
    color: '#94A3B8',
    textAlign: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#E2E8F0',
    paddingTop: 6,
  },
})

function formatDateNl(date?: string | null): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('nl-BE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date))
}

function formatCurrencyNl(amount: number): string {
  return new Intl.NumberFormat('nl-BE', { style: 'currency', currency: 'EUR' }).format(amount || 0)
}

export function InvoicePdfDocument({ data }: { data: InvoicePdfData }) {
  const dueAmount = data.total - data.amountPaid

  // Group VAT amounts by rate for the breakdown, in case multiple rates are used.
  const vatByRate = new Map<number, number>()
  for (const line of data.lineItems) {
    const vatAmount = line.total_inc_vat - line.total_ex_vat
    vatByRate.set(line.vat_rate, (vatByRate.get(line.vat_rate) ?? 0) + vatAmount)
  }
  const vatRates = Array.from(vatByRate.keys()).sort((a, b) => a - b)

  return (
    <Document title={`Factuur ${data.reference}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.companyName}>{data.contractor.name}</Text>
          <Text style={{ fontSize: 9, color: '#64748B' }}>Referentie: {data.reference}</Text>
        </View>

        <Text style={styles.title}>FACTUUR</Text>
        <Text style={styles.subtitle}>
          Factuurdatum {formatDateNl(data.issueDate)} · Vervaldatum {formatDateNl(data.dueDate)}
        </Text>
        <View style={styles.hr} />

        {/* Parties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Partijen</Text>
          <View style={styles.partiesRow}>
            <View style={styles.partyBox}>
              <Text style={styles.partyLabel}>Van</Text>
              <Text style={styles.partyName}>{data.contractor.name}</Text>
              <Text style={styles.partyLine}>BTW: {data.contractor.vatNumber}</Text>
              <Text style={styles.partyLine}>{data.contractor.address}</Text>
            </View>
            <View style={styles.partyBox}>
              <Text style={styles.partyLabel}>Factuur aan</Text>
              <Text style={styles.partyName}>{data.client.name}</Text>
              <Text style={styles.partyLine}>BTW: {data.client.vatNumber ?? 'n.v.t.'}</Text>
              <Text style={styles.partyLine}>{data.client.address}</Text>
            </View>
          </View>
        </View>

        {/* Line items table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{data.title}</Text>
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderCell, styles.colDescription]}>Omschrijving</Text>
              <Text style={[styles.tableHeaderCell, styles.colQty]}>Aantal</Text>
              <Text style={[styles.tableHeaderCell, styles.colUnit]}>Eenheid</Text>
              <Text style={[styles.tableHeaderCell, styles.colUnitPrice]}>Eenheidsprijs</Text>
              <Text style={[styles.tableHeaderCell, styles.colVat]}>BTW%</Text>
              <Text style={[styles.tableHeaderCell, styles.colTotal]}>Totaal excl.</Text>
            </View>
            {data.lineItems.map((line, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.colDescription]}>{line.description}</Text>
                <Text style={[styles.tableCell, styles.colQty]}>{line.quantity}</Text>
                <Text style={[styles.tableCell, styles.colUnit]}>{line.unit}</Text>
                <Text style={[styles.tableCell, styles.colUnitPrice]}>{formatCurrencyNl(line.unit_price)}</Text>
                <Text style={[styles.tableCell, styles.colVat]}>{line.vat_rate}%</Text>
                <Text style={[styles.tableCell, styles.colTotal]}>{formatCurrencyNl(line.total_ex_vat)}</Text>
              </View>
            ))}
          </View>

          {/* Totals */}
          <View style={styles.totalsBlock}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotaal (excl. BTW)</Text>
              <Text style={styles.totalsValue}>{formatCurrencyNl(data.subtotal)}</Text>
            </View>
            {vatRates.map((rate) => (
              <View key={rate} style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>BTW {rate}%</Text>
                <Text style={styles.totalsValue}>{formatCurrencyNl(vatByRate.get(rate) ?? 0)}</Text>
              </View>
            ))}
            <View style={styles.totalsDivider} />
            <View style={styles.totalsGrandRow}>
              <Text style={styles.totalsGrandLabel}>Totaal (incl. BTW)</Text>
              <Text style={styles.totalsGrandValue}>{formatCurrencyNl(data.total)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Reeds betaald</Text>
              <Text style={styles.totalsValue}>{formatCurrencyNl(data.amountPaid)}</Text>
            </View>
            <View style={styles.dueBox}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.dueLabel}>Te betalen</Text>
                <Text style={styles.dueValue}>{formatCurrencyNl(dueAmount)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Notes */}
        {data.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Opmerkingen</Text>
            <Text style={styles.notesText}>{data.notes}</Text>
          </View>
        )}

        {/* Payment info */}
        <View style={styles.paymentBox} wrap={false}>
          <Text style={styles.paymentTitle}>Betalingsgegevens</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Rekeningnummer (IBAN)</Text>
            <Text style={styles.paymentValue}>{data.bankAccount ?? '—'}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Gestructureerde mededeling</Text>
            <Text style={styles.paymentValue}>
              {data.structuredReference ? formatStructuredReference(data.structuredReference.replace(/\D/g, '')) : '—'}
            </Text>
          </View>
          <Text style={styles.paymentNote}>
            Gelieve bij betaling steeds de gestructureerde mededeling te vermelden.
          </Text>
        </View>

        <Text style={styles.footer}>
          {data.contractor.name} · {data.reference} · Dit document is gegenereerd via Archos.
        </Text>
      </Page>
    </Document>
  )
}
