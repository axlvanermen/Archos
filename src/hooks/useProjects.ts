import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import type { Project } from '@/types'

export function useProjects() {
  const { company } = useAuth()

  return useQuery({
    queryKey: ['projects', company?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, client:clients(*), manager:users(*)')
        .eq('company_id', company!.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Project[]
    },
    enabled: !!company?.id,
  })
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: ['projects', 'detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, client:clients(*), manager:users(*)')
        .eq('id', id!)
        .single()
      if (error) throw error
      return data as Project
    },
    enabled: !!id,
  })
}

export function useCreateProject() {
  const { company } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: Partial<Project>) => {
      const { data, error } = await supabase
        .from('projects')
        .insert({ ...input, company_id: company!.id })
        .select()
        .single()
      if (error) throw error
      return data as Project
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<Project> & { id: string }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(input)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as Project
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['projects', 'detail', data.id] })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('projects').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
