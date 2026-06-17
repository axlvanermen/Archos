import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

export interface ProjectPhase {
  id: string
  project_id: string
  company_id: string
  name: string
  start_date: string
  end_date: string
  status: 'gepland' | 'lopend' | 'voltooid' | 'vertraagd'
  progress: number
  sort_order: number
  created_at: string
  updated_at: string
}

export interface PlanningProject {
  id: string
  name: string
  start_date: string
  end_date: string
  phases: ProjectPhase[]
}

export function usePlanningProjects() {
  const { company } = useAuth()

  return useQuery({
    queryKey: ['planning', company?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, start_date, end_date, phases:project_phases(*)')
        .eq('company_id', company!.id)
        .not('start_date', 'is', null)
        .not('end_date', 'is', null)
        .order('start_date', { ascending: true })
      if (error) throw error

      return (data as PlanningProject[]).filter((p) => p.phases && p.phases.length > 0)
    },
    enabled: !!company?.id,
  })
}

export function useUpdatePhase() {
  const queryClient = useQueryClient()
  const { company } = useAuth()

  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<ProjectPhase> & { id: string }) => {
      const { data, error } = await supabase
        .from('project_phases')
        .update(input)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as ProjectPhase
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planning', company?.id] })
    },
  })
}
