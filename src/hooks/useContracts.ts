import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import type { Contract } from '@/types'

export function useContracts() {
  const { company } = useAuth()

  return useQuery({
    queryKey: ['contracts', company?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contracts')
        .select('*, project:projects(*), client:clients(*)')
        .eq('company_id', company!.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Contract[]
    },
    enabled: !!company?.id,
  })
}

export function useContract(id: string | undefined) {
  return useQuery({
    queryKey: ['contracts', 'detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contracts')
        .select('*, project:projects(*), client:clients(*)')
        .eq('id', id!)
        .single()
      if (error) throw error
      return data as Contract
    },
    enabled: !!id,
  })
}

export function useCreateContract() {
  const { company } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: Partial<Contract>) => {
      const { data, error } = await supabase
        .from('contracts')
        .insert({ ...input, company_id: company!.id })
        .select()
        .single()
      if (error) throw error
      return data as Contract
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
    },
  })
}

export function useUpdateContract() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<Contract> & { id: string }) => {
      const { data, error } = await supabase
        .from('contracts')
        .update(input)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as Contract
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
      queryClient.invalidateQueries({ queryKey: ['contracts', 'detail', data.id] })
    },
  })
}

export function useDeleteContract() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('contracts').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
    },
  })
}
