import type { InvoiceLineItem } from '@/types'
import type { InvoiceStatus } from './invoiceStatus'
import { generateStructuredReference } from '@/lib/belgianStructuredReference'

// Mock company profile — same contractor used across the app's PDFs
// (see src/pages/contracts/mockContractData.ts for the contract-side equivalent).
export const mockContractorCompany = {
  name: 'Bouwbedrijf Archos BVBA',
  vatNumber: 'BE 0123.456.789',
  address: 'Industrielaan 42, 9000 Gent, België',
  bankAccount: 'BE71 0961 2345 6769',
}

export interface MockProject {
  id: string
  name: string
  address: string
  clientId: string
}

export interface MockClient {
  id: string
  name: string
  vatNumber: string | null
  address: string
}

// Same project/client names used in src/pages/contracts/mockContractData.ts so
// the mock data stays consistent across modules.
export const mockProjects: MockProject[] = [
  { id: '1', name: 'Villa Knokke', address: 'Zeedijk 145, 8300 Knokke-Heist', clientId: '1' },
  { id: '2', name: 'Kantoorgebouw Hasselt', address: 'Kempische Steenweg 310, 3500 Hasselt', clientId: '2' },
  { id: '3', name: 'Appartement Gent', address: 'Korenmarkt 9, 9000 Gent', clientId: '3' },
  { id: '4', name: 'Woning Leuven', address: 'Tiensestraat 87, 3000 Leuven', clientId: '4' },
  { id: '5', name: 'Residentie Brugge', address: 'Smedenstraat 22, 8000 Brugge', clientId: '5' },
  { id: '6', name: 'Magazijn Antwerpen', address: 'Noorderlaan 150, 2030 Antwerpen', clientId: '6' },
]

export const mockClients: MockClient[] = [
  { id: '1', name: 'Familie De Groote', vatNumber: null, address: 'Zeedijk 145, 8300 Knokke-Heist' },
  { id: '2', name: 'Immo Invest NV', vatNumber: 'BE0456789123', address: 'Kempische Steenweg 310, 3500 Hasselt' },
  { id: '3', name: 'Stad Gent', vatNumber: 'BE0207451227', address: 'Botermarkt 1, 9000 Gent' },
  { id: '4', name: 'Dhr. Bogaert', vatNumber: null, address: 'Tiensestraat 87, 3000 Leuven' },
  { id: '5', name: 'Brugge Invest', vatNumber: 'BE0890123456', address: 'Smedenstraat 22, 8000 Brugge' },
  { id: '6', name: 'Logistiek BV', vatNumber: 'BE0678912345', address: 'Noorderlaan 150, 2030 Antwerpen' },
]

export const paymentTermsOptions = [
  '30 dagen na factuur',
  '50% voorschot, 50% bij oplevering',
  'Maandelijkse termijnen',
  'Aangepast',
] as const

export interface MockInvoice {
  id: string
  reference: string
  title: string
  status: InvoiceStatus
  projectId: string
  clientId: string
  issueDate: string
  dueDate: string | null
  paymentDate: string | null
  lineItems: InvoiceLineItem[]
  subtotal: number
  vatTotal: number
  total: number
  amountPaid: number
  notes: string | null
  paymentTerms: string | null
  bankAccount: string | null
  structuredReference: string
}

function round(n: number): number {
  return Math.round(n * 100) / 100
}

function buildLineItems(
  raw: { description: string; quantity: number; unit: string; unitPrice: number; vatRate: number }[],
): InvoiceLineItem[] {
  return raw.map((r, idx) => {
    const totalExVat = round(r.quantity * r.unitPrice)
    const totalIncVat = round(totalExVat * (1 + r.vatRate / 100))
    return {
      id: `li-${idx + 1}`,
      description: r.description,
      quantity: r.quantity,
      unit: r.unit,
      unit_price: r.unitPrice,
      vat_rate: r.vatRate,
      total_ex_vat: totalExVat,
      total_inc_vat: totalIncVat,
      sort_order: idx,
    }
  })
}

function totals(lineItems: InvoiceLineItem[]): { subtotal: number; vatTotal: number; total: number } {
  const subtotal = round(lineItems.reduce((sum, l) => sum + l.total_ex_vat, 0))
  const vatTotal = round(lineItems.reduce((sum, l) => sum + (l.total_inc_vat - l.total_ex_vat), 0))
  return { subtotal, vatTotal, total: round(subtotal + vatTotal) }
}

// Reference "today" used to judge overdue status for the mock data.
export const MOCK_TODAY = '2025-06-16'

const invoice1Lines = buildLineItems([
  { description: 'Ruwbouw fase 1 - funderingen en kelderverdieping', quantity: 1, unit: 'vast bedrag', unitPrice: 68500, vatRate: 21 },
  { description: 'Materiaalkosten beton en wapening', quantity: 1, unit: 'vast bedrag', unitPrice: 18750, vatRate: 21 },
  { description: 'Loodgieterswerken - aanleg leidingen', quantity: 1, unit: 'vast bedrag', unitPrice: 9200, vatRate: 21 },
])
const invoice1Totals = totals(invoice1Lines)

const invoice2Lines = buildLineItems([
  { description: 'Ruwbouw verdieping 1-3', quantity: 1, unit: 'vast bedrag', unitPrice: 145000, vatRate: 21 },
  { description: 'Technieken HVAC - installatie', quantity: 1, unit: 'vast bedrag', unitPrice: 42000, vatRate: 21 },
  { description: 'Elektriciteitswerken', quantity: 1, unit: 'vast bedrag', unitPrice: 28500, vatRate: 21 },
  { description: 'Gevelbekleding natuursteen', quantity: 320, unit: 'm²', unitPrice: 95, vatRate: 21 },
])
const invoice2Totals = totals(invoice2Lines)

const invoice3Lines = buildLineItems([
  { description: 'Sloopwerken bestaande indeling', quantity: 1, unit: 'vast bedrag', unitPrice: 4200, vatRate: 6 },
  { description: 'Renovatie sanitair en badkamer', quantity: 1, unit: 'vast bedrag', unitPrice: 12800, vatRate: 6 },
  { description: 'Schilderwerken binnen', quantity: 145, unit: 'm²', unitPrice: 18, vatRate: 6 },
])
const invoice3Totals = totals(invoice3Lines)

const invoice4Lines = buildLineItems([
  { description: 'Ruwbouw fase 1', quantity: 1, unit: 'vast bedrag', unitPrice: 52000, vatRate: 21 },
  { description: 'Dakwerken - isolatie en dakpannen', quantity: 1, unit: 'vast bedrag', unitPrice: 23400, vatRate: 21 },
])
const invoice4Totals = totals(invoice4Lines)

const invoice5Lines = buildLineItems([
  { description: 'Ruwbouw fase 2 - 12 appartementen', quantity: 1, unit: 'vast bedrag', unitPrice: 210000, vatRate: 21 },
  { description: 'Materiaalkosten beton', quantity: 1, unit: 'vast bedrag', unitPrice: 38500, vatRate: 21 },
  { description: 'Liftinstallatie', quantity: 1, unit: 'vast bedrag', unitPrice: 32000, vatRate: 21 },
])
const invoice5Totals = totals(invoice5Lines)

const invoice6Lines = buildLineItems([
  { description: 'Voorbereidende werken en grondwerk', quantity: 1, unit: 'vast bedrag', unitPrice: 15600, vatRate: 21 },
])
const invoice6Totals = totals(invoice6Lines)

const invoice7Lines = buildLineItems([
  { description: 'Creditnota - correctie materiaalkosten beton (overschatting hoeveelheid)', quantity: 1, unit: 'vast bedrag', unitPrice: -3200, vatRate: 21 },
])
const invoice7Totals = totals(invoice7Lines)

export const mockInvoices: MockInvoice[] = [
  {
    id: '1',
    reference: 'FACT-2025-001',
    title: 'Factuur - ruwbouw en materiaalkosten',
    status: 'paid',
    projectId: '1',
    clientId: '1',
    issueDate: '2025-02-10',
    dueDate: '2025-03-12',
    paymentDate: '2025-03-05',
    lineItems: invoice1Lines,
    ...invoice1Totals,
    amountPaid: invoice1Totals.total,
    notes: 'Bedankt voor uw vertrouwen.',
    paymentTerms: '30 dagen na factuur',
    bankAccount: mockContractorCompany.bankAccount,
    structuredReference: generateStructuredReference(202500100110001),
  },
  {
    id: '2',
    reference: 'FACT-2025-002',
    title: 'Factuur - ruwbouw, technieken en gevelwerken',
    status: 'sent',
    projectId: '2',
    clientId: '2',
    issueDate: '2025-05-20',
    dueDate: '2025-06-19',
    paymentDate: null,
    lineItems: invoice2Lines,
    ...invoice2Totals,
    amountPaid: 0,
    notes: 'Gelieve te betalen voor de vervaldatum.',
    paymentTerms: '30 dagen na factuur',
    bankAccount: mockContractorCompany.bankAccount,
    structuredReference: generateStructuredReference(202500200220002),
  },
  {
    id: '3',
    reference: 'FACT-2025-003',
    title: 'Factuur - renovatiewerken appartement (6% BTW)',
    status: 'sent',
    projectId: '3',
    clientId: '3',
    issueDate: '2025-05-28',
    dueDate: '2025-06-27',
    paymentDate: null,
    lineItems: invoice3Lines,
    ...invoice3Totals,
    amountPaid: 0,
    notes: 'Verlaagd BTW-tarief van 6% van toepassing op renovatie van woning ouder dan 10 jaar.',
    paymentTerms: '30 dagen na factuur',
    bankAccount: mockContractorCompany.bankAccount,
    structuredReference: generateStructuredReference(202500300330003),
  },
  {
    id: '4',
    reference: 'FACT-2025-004',
    title: 'Factuur - ruwbouw en dakwerken',
    status: 'overdue',
    projectId: '4',
    clientId: '4',
    issueDate: '2025-04-01',
    dueDate: '2025-05-01',
    paymentDate: null,
    lineItems: invoice4Lines,
    ...invoice4Totals,
    amountPaid: 20000,
    notes: 'Eerste herinnering verstuurd op 10/05/2025.',
    paymentTerms: '30 dagen na factuur',
    bankAccount: mockContractorCompany.bankAccount,
    structuredReference: generateStructuredReference(202500400440004),
  },
  {
    id: '5',
    reference: 'FACT-2025-005',
    title: 'Factuur - ruwbouw fase 2 en liftinstallatie',
    status: 'draft',
    projectId: '5',
    clientId: '5',
    issueDate: '2025-06-15',
    dueDate: '2025-07-15',
    paymentDate: null,
    lineItems: invoice5Lines,
    ...invoice5Totals,
    amountPaid: 0,
    notes: null,
    paymentTerms: '30 dagen na factuur',
    bankAccount: mockContractorCompany.bankAccount,
    structuredReference: generateStructuredReference(202500500550005),
  },
  {
    id: '6',
    reference: 'FACT-2025-006',
    title: 'Factuur - voorbereidende werken',
    status: 'cancelled',
    projectId: '6',
    clientId: '6',
    issueDate: '2025-03-15',
    dueDate: '2025-04-14',
    paymentDate: null,
    lineItems: invoice6Lines,
    ...invoice6Totals,
    amountPaid: 0,
    notes: 'Project tijdelijk stopgezet door klant; factuur geannuleerd.',
    paymentTerms: '30 dagen na factuur',
    bankAccount: mockContractorCompany.bankAccount,
    structuredReference: generateStructuredReference(202500600660006),
  },
  {
    id: '7',
    reference: 'FACT-2025-007-CN',
    title: 'Creditnota - correctie factuur FACT-2025-001',
    status: 'credit_note',
    projectId: '1',
    clientId: '1',
    issueDate: '2025-03-20',
    dueDate: null,
    paymentDate: '2025-03-20',
    lineItems: invoice7Lines,
    ...invoice7Totals,
    amountPaid: invoice7Totals.total,
    notes: 'Creditnota ter compensatie van overschatte materiaalkosten op FACT-2025-001.',
    paymentTerms: null,
    bankAccount: mockContractorCompany.bankAccount,
    structuredReference: generateStructuredReference(202500700770007),
  },
]

export function getProjectById(id: string): MockProject | undefined {
  return mockProjects.find((p) => p.id === id)
}

export function getClientById(id: string): MockClient | undefined {
  return mockClients.find((c) => c.id === id)
}
