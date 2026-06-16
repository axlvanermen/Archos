import type { ContractClause } from './ContractPdfDocument'

// Mock company profile — would come from the company's settings/profile in a
// real backend; the contractor side of a contract is never user-entered.
export const mockContractorCompany = {
  name: 'Bouwbedrijf Archos BVBA',
  vatNumber: 'BE 0123.456.789',
  address: 'Industrielaan 42, 9000 Gent, België',
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

// Same project/client names used in ProjectsPage.tsx and ClientsPage.tsx mock data
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

export const defaultClauses: ContractClause[] = [
  {
    id: 'uitvoeringstermijn',
    title: 'Uitvoeringstermijn & vertragingsboete',
    selected: true,
    text: 'De werken worden uitgevoerd binnen de overeengekomen termijn, behoudens schorsingen erkend door beide partijen. Bij vertraging te wijten aan de aannemer kan een schadevergoeding van 0,1% van de aannemingssom per werkdag vertraging worden toegepast, met een maximum van 10% van de totale aannemingssom.',
  },
  {
    id: 'garantie',
    title: 'Garantie (tienjarige aansprakelijkheid bouw)',
    selected: true,
    text: 'De aannemer is gehouden tot de tienjarige aansprakelijkheid voorzien in de artikelen 1792 en 2270 van het Burgerlijk Wetboek voor gebreken die de stabiliteit of soliditeit van het bouwwerk in het gedrang brengen. Voor zichtbare gebreken geldt de waarborg bij de voorlopige oplevering.',
  },
  {
    id: 'betalingsvoorwaarden',
    title: 'Betalingsvoorwaarden & laattijdige betaling',
    selected: true,
    text: 'Facturen zijn betaalbaar binnen de overeengekomen termijn na factuurdatum. Bij laattijdige betaling is van rechtswege en zonder ingebrekestelling een nalatigheidsintrest van 1% per maand verschuldigd, vermeerderd met een forfaitaire schadevergoeding van 10% van het openstaande bedrag met een minimum van 250 euro.',
  },
  {
    id: 'overmacht',
    title: 'Overmacht',
    selected: true,
    text: 'Geen van de partijen kan aansprakelijk worden gesteld voor de niet-uitvoering of vertraging van haar verbintenissen indien deze het gevolg is van overmacht, waaronder onder meer extreme weersomstandigheden, materiaaltekorten, overheidsmaatregelen of stakingen. De uitvoeringstermijn wordt in dat geval van rechtswege verlengd.',
  },
  {
    id: 'ontbinding',
    title: 'Ontbinding',
    selected: true,
    text: 'Bij ernstige wanprestatie van een partij die niet binnen 14 dagen na schriftelijke ingebrekestelling wordt verholpen, kan de andere partij de overeenkomst eenzijdig ontbinden, onverminderd haar recht op schadevergoeding voor de reeds geleverde prestaties en geleden schade.',
  },
  {
    id: 'geschillenregeling',
    title: 'Geschillenregeling (bevoegde rechtbank / Belgisch recht)',
    selected: true,
    text: 'Deze overeenkomst wordt beheerst door het Belgisch recht. In geval van geschil zijn uitsluitend de rechtbanken van het gerechtelijk arrondissement waar de aannemer haar maatschappelijke zetel heeft, bevoegd, behoudens andersluidende dwingende wettelijke bepaling.',
  },
]

export const paymentTermsOptions = [
  '30 dagen na factuur',
  '50% voorschot, 50% bij oplevering',
  'Maandelijkse termijnen',
  'Aangepast',
] as const

export interface MockContract {
  id: string
  reference: string
  title: string
  description: string
  status: 'draft' | 'sent' | 'signed' | 'active' | 'completed' | 'cancelled'
  projectId: string
  clientId: string
  contractValue: number
  paymentTerms: string
  signDate: string | null
  startDate: string
  endDate: string
  clauses: ContractClause[]
}

export const mockContracts: MockContract[] = [
  {
    id: '1',
    reference: 'CONTR-2025-001',
    title: 'Aannemingsovereenkomst nieuwbouw villa',
    description: 'Volledige nieuwbouw van een luxevilla met 5 slaapkamers, zwembad en dubbele garage.',
    status: 'active',
    projectId: '1',
    clientId: '1',
    contractValue: 380000,
    paymentTerms: '50% voorschot, 50% bij oplevering',
    signDate: '2025-01-08',
    startDate: '2025-01-10',
    endDate: '2025-06-30',
    clauses: defaultClauses,
  },
  {
    id: '2',
    reference: 'CONTR-2025-002',
    title: 'Aannemingsovereenkomst kantoorgebouw',
    description: 'Ruwbouw, technieken en afwerking van een nieuw kantoorgebouw van 3 verdiepingen.',
    status: 'signed',
    projectId: '2',
    clientId: '2',
    contractValue: 1250000,
    paymentTerms: 'Maandelijkse termijnen',
    signDate: '2025-01-28',
    startDate: '2025-02-01',
    endDate: '2025-12-15',
    clauses: defaultClauses,
  },
  {
    id: '3',
    reference: 'CONTR-2025-003',
    title: 'Aannemingsovereenkomst appartementsrenovatie',
    description: 'Volledige renovatie van een appartement in het centrum van Gent.',
    status: 'sent',
    projectId: '3',
    clientId: '3',
    contractValue: 620000,
    paymentTerms: '30 dagen na factuur',
    signDate: null,
    startDate: '2025-04-01',
    endDate: '2025-10-31',
    clauses: defaultClauses,
  },
  {
    id: '4',
    reference: 'CONTR-2025-004',
    title: 'Aannemingsovereenkomst woning Leuven',
    description: 'Bouw van een eengezinswoning met passiefhuisnorm.',
    status: 'draft',
    projectId: '4',
    clientId: '4',
    contractValue: 285000,
    paymentTerms: '50% voorschot, 50% bij oplevering',
    signDate: null,
    startDate: '2025-06-15',
    endDate: '2025-11-30',
    clauses: defaultClauses,
  },
  {
    id: '5',
    reference: 'CONTR-2024-018',
    title: 'Aannemingsovereenkomst residentie Brugge',
    description: 'Nieuwbouw van een residentie met 12 appartementen.',
    status: 'completed',
    projectId: '5',
    clientId: '5',
    contractValue: 890000,
    paymentTerms: 'Maandelijkse termijnen',
    signDate: '2024-08-20',
    startDate: '2024-09-01',
    endDate: '2025-03-31',
    clauses: defaultClauses,
  },
  {
    id: '6',
    reference: 'CONTR-2025-005',
    title: 'Aannemingsovereenkomst magazijn',
    description: 'Bouw van een industrieel magazijn met kantoorruimte.',
    status: 'cancelled',
    projectId: '6',
    clientId: '6',
    contractValue: 145000,
    paymentTerms: '30 dagen na factuur',
    signDate: null,
    startDate: '2025-07-01',
    endDate: '2025-09-30',
    clauses: defaultClauses,
  },
]

export function getProjectById(id: string): MockProject | undefined {
  return mockProjects.find((p) => p.id === id)
}

export function getClientById(id: string): MockClient | undefined {
  return mockClients.find((c) => c.id === id)
}
