import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useTheme } from './ThemeContext'
import type { Company } from '@/types'

interface AuthContextType {
  session: Session | null
  user: SupabaseUser | null
  company: Company | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { applyTheme } = useTheme()

  const loadCompany = async (userId: string) => {
    try {
      // First find the user record to get company_id
      const { data: userRecord } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', userId)
        .single()

      if (!userRecord?.company_id) return null

      const { data: companyData } = await supabase
        .from('companies')
        .select('*')
        .eq('id', userRecord.company_id)
        .single()

      return companyData as Company | null
    } catch {
      return null
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      setSession(initialSession)
      setUser(initialSession?.user ?? null)

      if (initialSession?.user) {
        const companyData = await loadCompany(initialSession.user.id)
        setCompany(companyData)

        if (companyData) {
          applyTheme({
            primary: companyData.primary_color ?? '#0F172A',
            secondary: companyData.secondary_color ?? '#334155',
            accent: companyData.accent_color ?? '#F97316',
            logoUrl: companyData.logo_url ?? undefined,
            companyName: companyData.name,
          })
        }
      }

      setIsLoading(false)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession)
        setUser(newSession?.user ?? null)

        if (newSession?.user) {
          const companyData = await loadCompany(newSession.user.id)
          setCompany(companyData)

          if (companyData) {
            applyTheme({
              primary: companyData.primary_color ?? '#0F172A',
              secondary: companyData.secondary_color ?? '#334155',
              accent: companyData.accent_color ?? '#F97316',
              logoUrl: companyData.logo_url ?? undefined,
              companyName: companyData.name,
            })
          }
        } else {
          setCompany(null)
        }

        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const signOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
    setCompany(null)
  }

  return (
    <AuthContext.Provider value={{ session, user, company, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
