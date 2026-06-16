import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import type { Subcontractor } from '@/types'

export function useSubcontractors() {
  const { company } = useAuth()

  return useQuery({
    queryKey: ['subcontractors', company?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subcontractors')
        .select('*')
        .eq('company_id', company!.id)
        .order('name', { ascending: true })
      if (error) throw error
      return data as Subcontractor[]
    },
    enabled: !!company?.id,
  })
}

export function useSubcontractor(id: string | undefined) {
  return useQuery({
    queryKey: ['subcontractors', 'detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subcontractors')
        .select('*')
        .eq('id', id!)
        .single()
      if (error) throw error
      return data as Subcontractor
    },
    enabled: !!id,
  })
}

export function useCreateSubcontractor() {
  const { company } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: Partial<Subcontractor>) => {
      const { data, error } = await supabase
        .from('subcontractors')
        .insert({ ...input, company_id: company!.id })
        .select()
        .single()
      if (error) throw error
      return data as Subcontractor
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcontractors'] })
    },
  })
}

export function useUpdateSubcontractor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<Subcontractor> & { id: string }) => {
      const { data, error } = await supabase
        .from('subcontractors')
        .update(input)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as Subcontractor
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subcontractors'] })
      queryClient.invalidateQueries({ queryKey: ['subcontractors', 'detail', data.id] })
    },
  })
}

export function useDeleteSubcontractor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('subcontractors').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcontractors'] })
    },
  })
}
