import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import type { Client } from '@/types'

export function useClients() {
  const { company } = useAuth()

  return useQuery({
    queryKey: ['clients', company?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('company_id', company!.id)
        .order('name', { ascending: true })
      if (error) throw error
      return data as Client[]
    },
    enabled: !!company?.id,
  })
}

export function useClient(id: string | undefined) {
  return useQuery({
    queryKey: ['clients', 'detail', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('clients').select('*').eq('id', id!).single()
      if (error) throw error
      return data as Client
    },
    enabled: !!id,
  })
}

export function useCreateClient() {
  const { company } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: Partial<Client>) => {
      const { data, error } = await supabase
        .from('clients')
        .insert({ ...input, company_id: company!.id })
        .select()
        .single()
      if (error) throw error
      return data as Client
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}

export function useUpdateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<Client> & { id: string }) => {
      const { data, error } = await supabase
        .from('clients')
        .update(input)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as Client
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['clients', 'detail', data.id] })
    },
  })
}

export function useDeleteClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clients').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}
