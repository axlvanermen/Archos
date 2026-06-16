import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import type { Task } from '@/types'

export function useTasks() {
  const { company } = useAuth()

  return useQuery({
    queryKey: ['tasks', company?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, project:projects(*), assignee:users(*)')
        .eq('company_id', company!.id)
        .order('due_date', { ascending: true, nullsFirst: false })
      if (error) throw error
      return data as Task[]
    },
    enabled: !!company?.id,
  })
}

export function useTask(id: string | undefined) {
  return useQuery({
    queryKey: ['tasks', 'detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, project:projects(*), assignee:users(*)')
        .eq('id', id!)
        .single()
      if (error) throw error
      return data as Task
    },
    enabled: !!id,
  })
}

export function useCreateTask() {
  const { company, user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: Partial<Task>) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert({ ...input, company_id: company!.id, created_by: user!.id })
        .select()
        .single()
      if (error) throw error
      return data as Task
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<Task> & { id: string }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(input)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as Task
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['tasks', 'detail', data.id] })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
