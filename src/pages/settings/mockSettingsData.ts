import { UserRole } from '@/types'

export interface TeamMember {
  id: string
  name: string
  initials: string
  email: string
  role: UserRole
  color: string
}

export const mockTeamMembers: TeamMember[] = [
  { id: '1', name: 'Jan Peeters', initials: 'JP', email: 'jan.peeters@archos.be', role: UserRole.Owner, color: 'bg-blue-500' },
  { id: '2', name: 'Sarah Claes', initials: 'SC', email: 'sarah.claes@archos.be', role: UserRole.ProjectManager, color: 'bg-purple-500' },
  { id: '3', name: 'Tom Martens', initials: 'TM', email: 'tom.martens@archos.be', role: UserRole.Foreman, color: 'bg-emerald-500' },
  { id: '4', name: 'Pieter VDB', initials: 'PV', email: 'pieter.vdb@archos.be', role: UserRole.Accountant, color: 'bg-amber-500' },
  { id: '5', name: 'Lisa Bogaert', initials: 'LB', email: 'lisa.bogaert@archos.be', role: UserRole.Worker, color: 'bg-rose-500' },
]

export const roleLabels: Record<UserRole, string> = {
  [UserRole.Owner]: 'Eigenaar',
  [UserRole.Admin]: 'Beheerder',
  [UserRole.ProjectManager]: 'Projectleider',
  [UserRole.Foreman]: 'Voorman',
  [UserRole.Worker]: 'Werknemer',
  [UserRole.Accountant]: 'Boekhouder',
}

export const roleBadgeClasses: Record<UserRole, string> = {
  [UserRole.Owner]: 'bg-[#C4943A]/10 text-[#C4943A] border-[#C4943A]/30',
  [UserRole.Admin]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  [UserRole.ProjectManager]: 'bg-blue-50 text-blue-700 border-blue-200',
  [UserRole.Foreman]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  [UserRole.Worker]: 'bg-slate-50 text-slate-600 border-slate-200',
  [UserRole.Accountant]: 'bg-amber-50 text-amber-700 border-amber-200',
}

export const mockCompanyProfile = {
  name: 'Bouwbedrijf Archos BVBA',
  vat_number: 'BE 0123.456.789',
  address: 'Industrielaan 42',
  city: 'Gent',
  postal_code: '9000',
  phone: '09 234 56 78',
  email: 'info@archos.be',
  website: 'https://www.archos.be',
}
