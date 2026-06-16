export type PhaseStatus = 'gepland' | 'lopend' | 'voltooid' | 'vertraagd'

export interface ProjectPhase {
  id: string
  name: string
  startDate: string
  endDate: string
  status: PhaseStatus
  progress: number
}

export interface PlanningProject {
  id: string
  name: string
  startDate: string
  endDate: string
  phases: ProjectPhase[]
}

// Same project names/ids/date-ranges as in mockContractData.ts / ProjectsPage.tsx
export const mockPlanningProjects: PlanningProject[] = [
  {
    id: '1',
    name: 'Villa Knokke',
    startDate: '2025-01-10',
    endDate: '2025-06-30',
    phases: [
      { id: '1-1', name: 'Voorbereiding & vergunningen', startDate: '2025-01-10', endDate: '2025-02-10', status: 'voltooid', progress: 100 },
      { id: '1-2', name: 'Ruwbouw', startDate: '2025-02-05', endDate: '2025-04-10', status: 'voltooid', progress: 100 },
      { id: '1-3', name: 'Technieken (elektriciteit/sanitair/HVAC)', startDate: '2025-04-05', endDate: '2025-05-20', status: 'lopend', progress: 65 },
      { id: '1-4', name: 'Afwerking', startDate: '2025-05-15', endDate: '2025-06-20', status: 'gepland', progress: 0 },
      { id: '1-5', name: 'Oplevering', startDate: '2025-06-20', endDate: '2025-06-30', status: 'gepland', progress: 0 },
    ],
  },
  {
    id: '2',
    name: 'Kantoorgebouw Hasselt',
    startDate: '2025-02-01',
    endDate: '2025-12-15',
    phases: [
      { id: '2-1', name: 'Voorbereiding & vergunningen', startDate: '2025-02-01', endDate: '2025-03-15', status: 'voltooid', progress: 100 },
      { id: '2-2', name: 'Ruwbouw', startDate: '2025-03-10', endDate: '2025-07-01', status: 'lopend', progress: 55 },
      { id: '2-3', name: 'Technieken (elektriciteit/sanitair/HVAC)', startDate: '2025-06-15', endDate: '2025-09-30', status: 'vertraagd', progress: 20 },
      { id: '2-4', name: 'Afwerking', startDate: '2025-09-20', endDate: '2025-11-15', status: 'gepland', progress: 0 },
      { id: '2-5', name: 'Oplevering', startDate: '2025-11-15', endDate: '2025-12-15', status: 'gepland', progress: 0 },
    ],
  },
  {
    id: '3',
    name: 'Appartement Gent',
    startDate: '2025-04-01',
    endDate: '2025-10-31',
    phases: [
      { id: '3-1', name: 'Voorbereiding & vergunningen', startDate: '2025-04-01', endDate: '2025-04-25', status: 'voltooid', progress: 100 },
      { id: '3-2', name: 'Ruwbouw', startDate: '2025-04-20', endDate: '2025-07-01', status: 'lopend', progress: 40 },
      { id: '3-3', name: 'Technieken (elektriciteit/sanitair/HVAC)', startDate: '2025-06-25', endDate: '2025-08-31', status: 'gepland', progress: 0 },
      { id: '3-4', name: 'Afwerking', startDate: '2025-08-25', endDate: '2025-10-10', status: 'gepland', progress: 0 },
      { id: '3-5', name: 'Oplevering', startDate: '2025-10-10', endDate: '2025-10-31', status: 'gepland', progress: 0 },
    ],
  },
  {
    id: '4',
    name: 'Woning Leuven',
    startDate: '2025-06-15',
    endDate: '2025-11-30',
    phases: [
      { id: '4-1', name: 'Voorbereiding & vergunningen', startDate: '2025-06-15', endDate: '2025-07-10', status: 'lopend', progress: 70 },
      { id: '4-2', name: 'Ruwbouw', startDate: '2025-07-05', endDate: '2025-09-01', status: 'gepland', progress: 0 },
      { id: '4-3', name: 'Technieken (elektriciteit/sanitair/HVAC)', startDate: '2025-08-25', endDate: '2025-10-10', status: 'gepland', progress: 0 },
      { id: '4-4', name: 'Afwerking', startDate: '2025-10-05', endDate: '2025-11-15', status: 'gepland', progress: 0 },
      { id: '4-5', name: 'Oplevering', startDate: '2025-11-15', endDate: '2025-11-30', status: 'gepland', progress: 0 },
    ],
  },
  {
    id: '5',
    name: 'Residentie Brugge',
    startDate: '2024-09-01',
    endDate: '2025-03-31',
    phases: [
      { id: '5-1', name: 'Voorbereiding & vergunningen', startDate: '2024-09-01', endDate: '2024-09-25', status: 'voltooid', progress: 100 },
      { id: '5-2', name: 'Ruwbouw', startDate: '2024-09-20', endDate: '2024-12-10', status: 'voltooid', progress: 100 },
      { id: '5-3', name: 'Technieken (elektriciteit/sanitair/HVAC)', startDate: '2024-12-05', endDate: '2025-02-01', status: 'voltooid', progress: 100 },
      { id: '5-4', name: 'Afwerking', startDate: '2025-01-25', endDate: '2025-03-15', status: 'voltooid', progress: 100 },
      { id: '5-5', name: 'Oplevering', startDate: '2025-03-15', endDate: '2025-03-31', status: 'voltooid', progress: 100 },
    ],
  },
  {
    id: '6',
    name: 'Magazijn Antwerpen',
    startDate: '2025-07-01',
    endDate: '2025-09-30',
    phases: [
      { id: '6-1', name: 'Voorbereiding & vergunningen', startDate: '2025-07-01', endDate: '2025-07-15', status: 'gepland', progress: 0 },
      { id: '6-2', name: 'Ruwbouw', startDate: '2025-07-12', endDate: '2025-08-15', status: 'gepland', progress: 0 },
      { id: '6-3', name: 'Technieken (elektriciteit/sanitair/HVAC)', startDate: '2025-08-10', endDate: '2025-09-10', status: 'gepland', progress: 0 },
      { id: '6-4', name: 'Afwerking', startDate: '2025-09-05', endDate: '2025-09-30', status: 'gepland', progress: 0 },
    ],
  },
]

export function getPlanningProjectById(id: string): PlanningProject | undefined {
  return mockPlanningProjects.find((p) => p.id === id)
}
