import React, { createContext, useContext, useEffect, useState } from 'react'

interface Theme {
  primary: string
  secondary: string
  accent: string
  logoUrl?: string
  companyName?: string
}

const defaults: Theme = {
  primary: '#0F172A',
  secondary: '#334155',
  accent: '#F97316',
}

interface ThemeContextType {
  theme: Theme
  applyTheme: (t: Theme) => void
  resetTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('archos_theme')
      return saved ? JSON.parse(saved) : defaults
    } catch {
      return defaults
    }
  })

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--color-primary', theme.primary)
    root.style.setProperty('--color-secondary', theme.secondary)
    root.style.setProperty('--color-accent', theme.accent)
  }, [theme])

  const applyTheme = (t: Theme) => {
    setTheme(t)
    try {
      localStorage.setItem('archos_theme', JSON.stringify(t))
    } catch {}
  }

  const resetTheme = () => applyTheme(defaults)

  return (
    <ThemeContext.Provider value={{ theme, applyTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
