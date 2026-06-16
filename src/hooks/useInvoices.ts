import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import type { Invoice } from '@/types'

export function useInvoices() {
  const { company } = useAuth()

  return useQuery({
    queryKey: ['invoices', company?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*, project:projects(*), client:clients(*)')
        .eq('company_id', company!.id)
        .order('issue_date', { ascending: false })
      if (error) throw error
      return data as Invoice[]
    },
    enabled: !!company?.id,
  })
}

export function useInvoice(id: string | undefined) {
  return useQuery({
    queryKey: ['invoices', 'detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*, project:projects(*), client:clients(*)')
        .eq('id', id!)
        .single()
      if (error) throw error
      return data as Invoice
    },
    enabled: !!id,
  })
}

export function useCreateInvoice() {
  const { company } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: Partial<Invoice>) => {
      const { data, error } = await supabase
        .from('invoices')
        .insert({ ...input, company_id: company!.id })
        .select()
        .single()
      if (error) throw error
      return data as Invoice
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
    },
  })
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<Invoice> & { id: string }) => {
      const { data, error } = await supabase
        .from('invoices')
        .update(input)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as Invoice
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      queryClient.invalidateQueries({ queryKey: ['invoices', 'detail', data.id] })
    },
  })
}

export function useMarkInvoicePaid() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) => {
      const { data, error } = await supabase
        .from('invoices')
        .update({ status: 'paid', amount_paid: amount, payment_date: new Date().toISOString().slice(0, 10) })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as Invoice
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      queryClient.invalidateQueries({ queryKey: ['invoices', 'detail', data.id] })
    },
  })
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('invoices').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
    },
  })
}
