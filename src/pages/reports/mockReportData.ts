// Mock aggregate data for the Rapporten module. Derived to stay consistent
// with the mock projects/contracts used elsewhere (mockContractData.ts):
// 6 projects, combined contract value ~€3.5M (380k + 1.25M + 620k + 285k + 890k + 145k = 3.57M).

export interface MonthlyRevenue {
  month: string
  invoiced: number
  paid: number
}

export const monthlyRevenue: MonthlyRevenue[] = [
  { month: 'Jan', invoiced: 312000, paid: 286000 },
  { month: 'Feb', invoiced: 268000, paid: 251000 },
  { month: 'Mrt', invoiced: 401000, paid: 358000 },
  { month: 'Apr', invoiced: 374000, paid: 340000 },
  { month: 'Mei', invoiced: 452000, paid: 398000 },
  { month: 'Jun', invoiced: 389000, paid: 332000 },
]

export interface ProjectStatusBreakdown {
  status: string
  label: string
  count: number
  dot: string
  bar: string
}

export const projectStatusBreakdown: ProjectStatusBreakdown[] = [
  { status: 'in_uitvoering', label: 'In uitvoering', count: 2, dot: 'bg-amber-500', bar: 'bg-amber-400' },
  { status: 'gewonnen', label: 'Opdracht', count: 1, dot: 'bg-emerald-500', bar: 'bg-emerald-400' },
  { status: 'offerte_verstuurd', label: 'Offerte verstuurd', count: 1, dot: 'bg-indigo-500', bar: 'bg-indigo-400' },
  { status: 'afgerond', label: 'Afgerond', count: 1, dot: 'bg-gray-400', bar: 'bg-gray-300' },
  { status: 'verloren', label: 'Verloren', count: 1, dot: 'bg-red-500', bar: 'bg-red-400' },
]

export interface TopClient {
  rank: number
  name: string
  revenue: number
  projectName: string
}

export const topClients: TopClient[] = [
  { rank: 1, name: 'Immo Invest NV', revenue: 1250000, projectName: 'Kantoorgebouw Hasselt' },
  { rank: 2, name: 'Brugge Invest', revenue: 890000, projectName: 'Residentie Brugge' },
  { rank: 3, name: 'Stad Gent', revenue: 620000, projectName: 'Appartement Gent' },
  { rank: 4, name: 'Familie De Groote', revenue: 380000, projectName: 'Villa Knokke' },
  { rank: 5, name: 'Dhr. Bogaert', revenue: 285000, projectName: 'Woning Leuven' },
]

export const overdueInvoices = {
  count: 3,
  totalAmount: 28500,
  oldestDays: 47,
}

// KPI summary derived from above
export const kpiSummary = {
  totalRevenue: 3570000, // sum of contractValue across mockContracts
  outstandingBalance: 142000, // invoiced minus paid, mock aggregate
  averageProjectValue: 595000, // 3.57M / 6
  winRate: 0.67, // offerte -> opdracht conversion (mock)
}
