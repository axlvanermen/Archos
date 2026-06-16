import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

// Shape of a selected/edited clause as produced by the wizard (step 3)
export interface ContractClause {
  id: string
  title: string
  text: string
  selected: boolean
}

// Minimal data the PDF needs — decoupled from the full Contract DB type so the
// wizard can pass in-progress (not-yet-persisted) data too.
export interface ContractPdfData {
  reference: string
  title: string
  description: string
  contractValue: number
  paymentTerms: string
  startDate: string
  endDate: string
  signDate?: string
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
  project: {
    name: string
    address: string
  }
  clauses: ContractClause[]
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
  body: {
    fontSize: 9.5,
    lineHeight: 1.5,
    color: '#334155',
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
  clauseBlock: {
    marginBottom: 10,
  },
  clauseTitle: {
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 3,
    color: '#0F172A',
  },
  signatureRow: {
    flexDirection: 'row',
    marginTop: 36,
    gap: 24,
  },
  signatureBox: {
    flex: 1,
  },
  signatureLabel: {
    fontSize: 9.5,
    fontWeight: 700,
    marginBottom: 24,
    color: '#0F172A',
  },
  signatureLine: {
    borderBottomWidth: 0.75,
    borderBottomColor: '#94A3B8',
    marginBottom: 4,
    height: 28,
  },
  signatureCaption: {
    fontSize: 8,
    color: '#94A3B8',
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

function formatDateNl(date?: string): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('nl-BE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date))
}

function formatCurrencyNl(amount: number): string {
  return new Intl.NumberFormat('nl-BE', { style: 'currency', currency: 'EUR' }).format(amount || 0)
}

export function ContractPdfDocument({ data }: { data: ContractPdfData }) {
  const selectedClauses = data.clauses.filter((c) => c.selected)

  return (
    <Document title={`Aannemingsovereenkomst ${data.reference}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.companyName}>{data.contractor.name}</Text>
          <Text style={{ fontSize: 9, color: '#64748B' }}>Referentie: {data.reference}</Text>
        </View>

        <Text style={styles.title}>AANNEMINGSOVEREENKOMST</Text>
        <Text style={styles.subtitle}>
          Opgemaakt op {formatDateNl(data.signDate ?? new Date().toISOString())}
        </Text>
        <View style={styles.hr} />

        {/* Parties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Partijen</Text>
          <View style={styles.partiesRow}>
            <View style={styles.partyBox}>
              <Text style={styles.partyLabel}>De aannemer</Text>
              <Text style={styles.partyName}>{data.contractor.name}</Text>
              <Text style={styles.partyLine}>BTW: {data.contractor.vatNumber}</Text>
              <Text style={styles.partyLine}>{data.contractor.address}</Text>
            </View>
            <View style={styles.partyBox}>
              <Text style={styles.partyLabel}>De opdrachtgever</Text>
              <Text style={styles.partyName}>{data.client.name}</Text>
              <Text style={styles.partyLine}>BTW: {data.client.vatNumber ?? 'n.v.t.'}</Text>
              <Text style={styles.partyLine}>{data.client.address}</Text>
            </View>
          </View>
        </View>

        {/* Object */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Voorwerp van de overeenkomst</Text>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Project</Text>
            <Text style={styles.fieldValue}>{data.project.name}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Werfadres</Text>
            <Text style={styles.fieldValue}>{data.project.address}</Text>
          </View>
          <View style={{ marginTop: 6 }}>
            <Text style={styles.fieldLabel}>Omschrijving van de werken</Text>
            <Text style={[styles.body, { marginTop: 3 }]}>{data.description || '—'}</Text>
          </View>
        </View>

        {/* Price */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Prijs en betalingsvoorwaarden</Text>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Totale aannemingssom</Text>
            <Text style={styles.fieldValue}>{formatCurrencyNl(data.contractValue)}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Betalingsvoorwaarden</Text>
            <Text style={styles.fieldValue}>{data.paymentTerms || '—'}</Text>
          </View>
        </View>

        {/* Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Looptijd</Text>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Startdatum</Text>
            <Text style={styles.fieldValue}>{formatDateNl(data.startDate)}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Einddatum (verwacht)</Text>
            <Text style={styles.fieldValue}>{formatDateNl(data.endDate)}</Text>
          </View>
        </View>

        {/* Clauses */}
        {selectedClauses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Bijzondere bepalingen</Text>
            {selectedClauses.map((clause, idx) => (
              <View key={clause.id} style={styles.clauseBlock} wrap={false}>
                <Text style={styles.clauseTitle}>5.{idx + 1} {clause.title}</Text>
                <Text style={styles.body}>{clause.text}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Signatures */}
        <View style={styles.signatureRow} wrap={false}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Voor de aannemer</Text>
            <Text style={styles.signatureCaption}>Datum: ____ / ____ / ________</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureCaption}>Handtekening</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Voor de opdrachtgever</Text>
            <Text style={styles.signatureCaption}>Datum: ____ / ____ / ________</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureCaption}>Handtekening</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          {data.contractor.name} · {data.reference} · Dit document is gegenereerd via Archos en vormt geen juridisch advies.
        </Text>
      </Page>
    </Document>
  )
}
